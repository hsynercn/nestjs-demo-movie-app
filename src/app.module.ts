import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './movies/movies.entity';
import { RoomsModule } from './rooms/rooms.module';
import { RoomEntity } from './rooms/rooms.entity';
import { SessionsModule } from './sessions/sessions.module';
import { SessionEntity } from './sessions/sessions.entity';
import { TicketsModule } from './tickets/tickets.module';
import { TicketEntity } from './tickets/tickets.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [MovieEntity, RoomEntity, SessionEntity, TicketEntity],
      synchronize: true,
    }),
    MoviesModule,
    RoomsModule,
    SessionsModule,
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
