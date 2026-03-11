import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JoinRoomDto } from "../dto/join-room.dto";
import { RoomService } from "../room/room.service";

@WebSocketGateway()
export class GameGateway {

  @WebSocketServer()
  server: Server;

  constructor(private roomService: RoomService) {}

  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, payload: JoinRoomDto) {

    const room = this.roomService.assignRoom(payload.playerId);

    client.join(room.id);

    this.server.to(room.id).emit('playerJoined', payload.playerId);

  }

}
