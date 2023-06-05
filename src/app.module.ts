import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './movies/movies.entity';
import { RoomsModule } from './rooms/rooms.module';
import { RoomEntity } from './rooms/room.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [MovieEntity, RoomEntity],
      synchronize: true,
    }),
    MoviesModule,
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
