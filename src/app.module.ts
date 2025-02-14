import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { EventService } from './event.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PrismaService, EventService],
})
export class AppModule {}
