import { Module } from "@nestjs/common";
import { RedisModule } from "../db/redis/redis.module";
import { RoomModule } from "../room/room.module";
import { GameGateway } from "./game.gateway";

@Module({
  imports: [RoomModule, RedisModule],
  providers: [GameGateway],
})
export class GatewayModule {}
