import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';

@Module({
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
