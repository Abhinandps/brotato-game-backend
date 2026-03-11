import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { GameInput } from "../game/game-input.interface";
import { Player } from "../player/player.interface";
import { Room } from "./room.interface";

@Injectable()
export class RoomService {

  rooms: Map<string, Room> = new Map();
  MAX_PLAYERS = 50;

  assignRoom(playerId: string, socketId: string): Room {

    for (const room of this.rooms.values()) {
      if (room.players.size < this.MAX_PLAYERS) {
        return this.addPlayerToRoom(room, playerId, socketId);
      }
    }

    const room = this.createRoom();
    return this.addPlayerToRoom(room, playerId, socketId);
  }

  getOrCreateRoom(roomId: string): Room {
    const room = this.rooms.get(roomId);
    if (room) {
      return room;
    }
    return this.createRoom(roomId);
  }

  enqueueInput(roomId: string, input: GameInput) {
    const room = this.getOrCreateRoom(roomId);
    room.inputs.push(input);
  }

  private createRoom(id?: string): Room {

    const room: Room = {
      id: id ?? randomUUID(),
      players: new Map(),
      enemies: new Map(),
      inputs: [],
      resultSaved: false,
      dirty: true,
      lastPublishedAt: 0,
      state: "WAITING"
    };

    this.rooms.set(room.id, room);

    return room;
  }

  private addPlayerToRoom(room: Room, playerId: string, socketId: string): Room {
    if (!room.players.has(playerId)) {
      const player: Player = {
        id: playerId,
        x: 0,
        y: 0,
        hp: 100,
        score: 0,
        socketId
      };
      room.players.set(playerId, player);
    }
    return room;
  }

}
