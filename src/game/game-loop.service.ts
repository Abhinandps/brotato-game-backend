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
  private readonly PUBLISH_INTERVAL_MS = 100;

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

    this.ensureRunning(room);
    this.updatePlayers(room);
    this.updateEnemies(room);
    this.checkCollisions(room);
    this.checkGameOver(room);
    this.publishState(room);
    this.persistMatchResult(room);

  }

  private updatePlayers(room: Room) {
    let changed = false;
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
      changed = true;
    }
    if (changed) {
      room.dirty = true;
    }
  }

  private updateEnemies(room: Room) {
    if (room.state === "FINISHED") {
      return;
    }
    if (room.enemies.size < 5) {
      this.enemyService.spawnEnemy(room);
      room.dirty = true;
    }
  }

  private checkCollisions(room: Room) {
    const before = Array.from(room.players.values()).map((p) => p.hp);
    this.simulationService.detectCollisions(room);
    const after = Array.from(room.players.values()).map((p) => p.hp);
    if (before.some((hp, idx) => hp !== after[idx])) {
      room.dirty = true;
    }
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
      room.dirty = true;
      this.redisService.publish(`game:events:${room.id}`, {
        roomId: room.id,
        type: "matchEnded",
      });
    }
  }

  private ensureRunning(room: Room) {
    if (room.state !== "WAITING") {
      return;
    }
    if (room.players.size > 0) {
      room.state = "RUNNING";
      room.dirty = true;
    }
  }

  private publishState(room: Room) {
    const now = Date.now();
    if (!room.dirty && now - room.lastPublishedAt < this.PUBLISH_INTERVAL_MS) {
      return;
    }
    const state = {
      roomId: room.id,
      players: Array.from(room.players.values()).map((p) => ({
        id: p.id,
        x: p.x,
        y: p.y,
        hp: p.hp,
        score: p.score,
      })),
      enemies: Array.from(room.enemies.values()),
      state: room.state,
    };
    this.redisService.publish(`game:state:${room.id}`, state);
    room.lastPublishedAt = now;
    room.dirty = false;
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
