import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Room } from "./room.interface";

@Injectable()
export class RoomService {

  rooms: Map<string, Room> = new Map();
  MAX_PLAYERS = 50;

  assignRoom(playerId: string): Room {

    for (const room of this.rooms.values()) {
      if (room.players.size < this.MAX_PLAYERS) {
        return room;
      }
    }

    return this.createRoom();
  }

  createRoom(): Room {

    const room: Room = {
      id: randomUUID(),
      players: new Map(),
      enemies: new Map(),
      state: "WAITING"
    };

    this.rooms.set(room.id, room);

    return room;
  }

}
