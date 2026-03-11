import { Injectable } from "@nestjs/common";
import { distance } from "./game.utils";
import { Room } from "../room/room.interface";

@Injectable()
export class SimulationService {

  detectCollisions(room: Room) {

   for (const player of room.players.values()) {

     for (const enemy of room.enemies.values()) {

       if (distance(player, enemy) < 20) {
         player.hp -= 10
       }

     }

   }

  }

}
