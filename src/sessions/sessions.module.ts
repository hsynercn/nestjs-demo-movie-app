import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { MoviesService } from 'src/movies/movies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './sessions.entity';

@Module({
  imports: [
    RoomsService,
    MoviesService,
    TypeOrmModule.forFeature([SessionEntity]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
