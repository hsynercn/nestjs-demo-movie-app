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
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './users/users.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/role.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DATABASE'),
          entities: [
            MovieEntity,
            RoomEntity,
            SessionEntity,
            TicketEntity,
            UserEntity,
          ],
          synchronize: true,
        };
      },
    }),
    MoviesModule,
    RoomsModule,
    SessionsModule,
    TicketsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
