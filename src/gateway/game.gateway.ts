import { OnModuleInit } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JoinRoomDto } from "../dto/join-room.dto";
import { RedisService } from "../db/redis/redis.service";
import { GameInput } from "../game/game-input.interface";
import { RoomService } from "../room/room.service";

@WebSocketGateway()
export class GameGateway implements OnModuleInit {

  @WebSocketServer()
  server: Server;

  constructor(
    private roomService: RoomService,
    private redisService: RedisService,
  ) {}

  async onModuleInit() {
    await this.redisService.psubscribe("game:state:*", (channel, payload) => {
      const roomId = channel.split(":")[2];
      if (!roomId) {
        return;
      }
      this.server.to(roomId).emit("stateUpdate", payload);
    });
  }

  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, payload: JoinRoomDto) {

    const room = this.roomService.assignRoom(payload.playerId, client.id);

    client.join(room.id);

    this.server.to(room.id).emit('playerJoined', payload.playerId);

  }

  @SubscribeMessage("playerInput")
  handlePlayerInput(_client: Socket, payload: GameInput) {
    if (!payload?.roomId) {
      return;
    }
    this.redisService.publish(`game:inputs:${payload.roomId}`, payload);
  }

}
