import { Module } from "@nestjs/common";
import { RoomModule } from "../room/room.module";
import { EnemyService } from "./enemy.service";
import { GameLoopService } from "./game-loop.service";
import { SimulationService } from "./simulation.service";

@Module({
  imports: [RoomModule],
  providers: [GameLoopService, SimulationService, EnemyService],
  exports: [GameLoopService, SimulationService, EnemyService],
})
export class GameModule {}
