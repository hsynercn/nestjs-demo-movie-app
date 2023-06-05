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

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  findOne(id: number) {
    return this.sessionRepository.findOne({ where: { id } });
  }

  findWithMovie(movieId: number) {
    return this.sessionRepository.find({ where: { movieId } });
  }

  findWithRoom(roomId: number) {
    return this.sessionRepository.find({ where: { roomId } });
  }

  async create(newSession: CreateSessionDto) {
    const conflictingSession = await this.findConflictingSessions(newSession);
    if (conflictingSession) {
      throw new BadRequestException('Session already exists');
    }
    const session = this.sessionRepository.create({ ...newSession });
    return this.sessionRepository.save(session);
  }

  async update(id: number, updateSessionDto: UpdateSessionDto) {
    const session = await this.findOne(id);
    if (!session) {
      throw new BadRequestException('Session not found');
    }
    const dateChanged =
      updateSessionDto.date && updateSessionDto.date !== session.date;
    const timeSlotChanged =
      updateSessionDto.timeSlot &&
      updateSessionDto.timeSlot !== session.timeSlot;
    const roomIdChanged =
      updateSessionDto.roomId && updateSessionDto.roomId !== session.roomId;
    if (dateChanged || timeSlotChanged || roomIdChanged) {
      const possibleNewSession = {
        ...session,
        ...updateSessionDto,
      };
      const conflictingSession = await this.findConflictingSessions(
        possibleNewSession,
      );
      if (conflictingSession) {
        throw new BadRequestException('Session already exists');
      }
    }

    Object.assign(session, updateSessionDto);
    return this.sessionRepository.save(session);
  }

  async remove(id: number) {
    const session = await this.findOne(id);
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
