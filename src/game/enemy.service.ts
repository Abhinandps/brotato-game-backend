import { Injectable } from "@nestjs/common";
import { randomX, randomY } from "./game.utils";
import { Enemy } from "./enemy.interface";
import { Room } from "../room/room.interface";
import { randomUUID } from "crypto";

@Injectable()
export class EnemyService {

  spawnEnemy(room: Room) {

    const enemy: Enemy = {
      id: randomUUID(),
      x: randomX(),
      y: randomY(),
      hp: 100
    }

    room.enemies.set(enemy.id, enemy)

  }

}
