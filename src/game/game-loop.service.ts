import { Injectable, OnModuleInit } from "@nestjs/common";
import { RedisService } from "../db/redis/redis.service";
import { MatchResultService } from "../db/mongo/match-result.service";
import { GameInput } from "./game-input.interface";
import { Room } from "../room/room.interface";
import { RoomService } from "../room/room.service";
import { SimulationService } from "./simulation.service";
import { EnemyService } from "./enemy.service";

@Injectable()
export class GameLoopService implements OnModuleInit {

  private loopHandle?: NodeJS.Timeout;

  constructor(
    private roomService: RoomService,
    private simulationService: SimulationService,
    private enemyService: EnemyService,
    private redisService: RedisService,
    private matchResultService: MatchResultService,
  ) {}

  async onModuleInit() {
    await this.redisService.psubscribe("game:inputs:*", (channel, payload: GameInput) => {
      const roomId = channel.split(":")[2];
      if (!roomId) {
        return;
      }
      const input = payload?.roomId ? payload : { ...payload, roomId };
      this.roomService.enqueueInput(roomId, input);
    });
    this.start();
  }

  start() {

    if (this.loopHandle) {
      return;
    }

    this.loopHandle = setInterval(() => {

      for (const room of this.roomService.rooms.values()) {

        this.updateRoom(room);

      }

    }, 50);

  }

  private updateRoom(room: Room) {

    this.updatePlayers(room);
    this.updateEnemies(room);
    this.checkCollisions(room);
    this.checkGameOver(room);
    this.publishState(room);
    this.persistMatchResult(room);

  }

  private updatePlayers(room: Room) {
    while (room.inputs.length > 0) {
      const input = room.inputs.shift();
      if (!input) {
        continue;
      }
      const player = room.players.get(input.playerId);
      if (!player) {
        continue;
      }
      player.x += input.dx ?? 0;
      player.y += input.dy ?? 0;
    }
  }

  private updateEnemies(room: Room) {
    if (room.state === "FINISHED") {
      return;
    }
    if (room.enemies.size < 5) {
      this.enemyService.spawnEnemy(room);
    }
  }

  private checkCollisions(room: Room) {
    this.simulationService.detectCollisions(room);
  }

  private checkGameOver(room: Room) {
    if (room.state === "FINISHED") {
      return;
    }
    if (room.players.size === 0) {
      return;
    }
    const allDead = Array.from(room.players.values()).every((p) => p.hp <= 0);
    if (allDead) {
      room.state = "FINISHED";
      this.redisService.publish(`game:events:${room.id}`, {
        roomId: room.id,
        type: "matchEnded",
      });
    }
  }

  private publishState(room: Room) {
    const state = {
      roomId: room.id,
      players: Array.from(room.players.values()),
      enemies: Array.from(room.enemies.values()),
      state: room.state,
    };
    this.redisService.publish(`game:state:${room.id}`, state);
  }

  private async persistMatchResult(room: Room) {
    if (room.state !== "FINISHED" || room.resultSaved) {
      return;
    }
    room.resultSaved = true;
    await this.matchResultService.saveResult({
      roomId: room.id,
      players: Array.from(room.players.values()).map((p) => ({
        id: p.id,
        score: p.score,
        hp: p.hp,
      })),
      enemies: Array.from(room.enemies.values()).map((e) => ({
        id: e.id,
        hp: e.hp,
      })),
      state: room.state,
    });
  }

}
