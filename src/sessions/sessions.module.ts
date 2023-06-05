import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './sessions.entity';
import { RoomsModule } from 'src/rooms/rooms.module';
import { MoviesModule } from 'src/movies/movies.module';

@Module({
  imports: [
    RoomsModule,
    MoviesModule,
    TypeOrmModule.forFeature([SessionEntity]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
