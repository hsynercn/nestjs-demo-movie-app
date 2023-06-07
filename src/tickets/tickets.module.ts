import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { RoomsModule } from 'src/rooms/rooms.module';
import { MoviesModule } from 'src/movies/movies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsModule } from 'src/sessions/sessions.module';
import { TicketEntity } from './tickets.entity';

@Module({
  imports: [
    RoomsModule,
    MoviesModule,
    SessionsModule,
    TypeOrmModule.forFeature([TicketEntity]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
