import { Module } from "@nestjs/common";
import { RoomModule } from "../room/room.module";
import { GameGateway } from "./game.gateway";

@Module({
  imports: [RoomModule],
  providers: [GameGateway],
})
export class GatewayModule {}
