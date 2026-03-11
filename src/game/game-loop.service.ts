import { Injectable } from "@nestjs/common";
import { Room } from "../room/room.interface";
import { RoomService } from "../room/room.service";
import { SimulationService } from "./simulation.service";
import { EnemyService } from "./enemy.service";

@Injectable()
export class GameLoopService {

  private loopHandle?: NodeJS.Timeout;

  constructor(
    private roomService: RoomService,
    private simulationService: SimulationService,
    private enemyService: EnemyService,
  ) {}

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

  }

  private updatePlayers(_room: Room) {
    // Placeholder for movement/input processing.
  }

  private updateEnemies(room: Room) {
    if (room.enemies.size < 5) {
      this.enemyService.spawnEnemy(room);
    }
  }

  private checkCollisions(room: Room) {
    this.simulationService.detectCollisions(room);
  }

}
