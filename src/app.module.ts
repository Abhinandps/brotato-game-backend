import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { RoomModule } from './room/room.module';
import { PlayerModule } from './player/player.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [GameModule, RoomModule, PlayerModule, GatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
