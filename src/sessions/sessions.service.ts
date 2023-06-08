import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from './sessions.entity';
import { Repository } from 'typeorm';
import { CreateSessionDto } from './dtos/create-session.dto';
import { UpdateSessionDto } from './dtos/update-session.dto';
import { RoomsService } from 'src/rooms/rooms.service';
import { MoviesService } from 'src/movies/movies.service';
import { ViewSessionDto } from './dtos/view-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
    private roomsService: RoomsService,
    private moviesService: MoviesService,
  ) {}

  findOne(id: number) {
    return this.sessionRepository.findOne({ where: { id } });
  }

  async findOneHydrated(id: number) {
    console.log('id', id);
    const session = await this.findOne(id);
    console.log('session', session);
    const room = await this.roomsService.findOne(session.roomId);
    const movie = await this.moviesService.findOne(session.movieId);
    const hydratedViewSessionDto: ViewSessionDto = {
      id: session.id,
      movieName: movie.name,
      roomName: room.name,
      date: session.date,
      timeSlot: session.timeSlot,
      capacity: room.capacity,
    };
    return hydratedViewSessionDto;
  }

  find() {
    return this.sessionRepository.find();
  }

  findWithMovie(movieId: number) {
    return this.sessionRepository.find({ where: { movieId } });
  }

  findWithRoom(roomId: number) {
    return this.sessionRepository.find({ where: { roomId } });
  }

  async create(newSession: CreateSessionDto) {
    const room = await this.roomsService.findOne(newSession.roomId);
    if (!room) {
      throw new BadRequestException('Session room not found');
    }

    const movie = await this.moviesService.findOne(newSession.movieId);
    if (!movie) {
      throw new BadRequestException('Session movie not found');
    }

    const conflictingSession = await this.findConflictingSessions(newSession);

    if (conflictingSession.length > 0) {
      throw new BadRequestException(
        'Session already exist with date, room and time slot',
      );
    }
    const session = this.sessionRepository.create({ ...newSession });
    return this.sessionRepository.save(session);
  }

  async update(id: number, updateSessionDto: UpdateSessionDto) {
    const session = await this.findOne(id);
    if (!session) {
      throw new BadRequestException('Session not found');
    }

    const room = this.roomsService.findOne(updateSessionDto.roomId);
    if (!room) {
      throw new BadRequestException('Session room not found');
    }

    const movie = this.moviesService.findOne(updateSessionDto.movieId);
    if (!movie) {
      throw new BadRequestException('Session movie not found');
    }

    const dateChanged =
      updateSessionDto.date && updateSessionDto.date !== session.date;
    const timeSlotChanged =
      updateSessionDto.timeSlot &&
      updateSessionDto.timeSlot !== session.timeSlot;
    const roomIdChanged =
      updateSessionDto.roomId && updateSessionDto.roomId !== session.roomId;
    console.log(`dateChanged: ${dateChanged}`);
    console.log(`timeSlotChanged: ${timeSlotChanged}`);
    console.log(`roomIdChanged: ${roomIdChanged}`);
    if (dateChanged || timeSlotChanged || roomIdChanged) {
      const possibleNewSession = {
        ...session,
        ...updateSessionDto,
      };
      const conflictingSession = await this.findConflictingSessions(
        possibleNewSession,
      );
      if (conflictingSession.length > 0) {
        throw new BadRequestException(
          'Session already exist with date, room and time slot',
        );
      }
    }

    Object.assign(session, updateSessionDto);
    return this.sessionRepository.save(session);
  }

  async remove(id: number) {
    const session = await this.findOne(id);
    console.log(session);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return this.sessionRepository.remove(session);
  }

  async findConflictingSessions(newSession: CreateSessionDto) {
    return await this.sessionRepository.find({
      where: {
        roomId: newSession.roomId,
        date: newSession.date,
        timeSlot: newSession.timeSlot,
      },
    });
  }
}
