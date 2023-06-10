import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsModule } from '../sessions/sessions.module';
import { TicketEntity } from './tickets.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SessionsModule,
    UsersModule,
    TypeOrmModule.forFeature([TicketEntity]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
