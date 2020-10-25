import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';

@Module({
  controllers: [],
  providers: [GameGateway],
})
export class GameModule {}
