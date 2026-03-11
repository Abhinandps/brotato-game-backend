import { Module } from "@nestjs/common";
import { RedisModule } from "../db/redis/redis.module";
import { RoomModule } from "../room/room.module";
import { EnemyService } from "./enemy.service";
import { GameLoopService } from "./game-loop.service";
import { SimulationService } from "./simulation.service";

@Module({
  imports: [RoomModule, RedisModule],
  providers: [GameLoopService, SimulationService, EnemyService],
  exports: [GameLoopService, SimulationService, EnemyService],
})
export class GameModule {}
