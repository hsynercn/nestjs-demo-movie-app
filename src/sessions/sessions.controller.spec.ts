import { Test, TestingModule } from '@nestjs/testing';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SessionEntity } from './sessions.entity';
import { CreateSessionDto } from './dtos/create-session.dto';
import { TimeSlot } from '../shared/enums';
import { ViewSessionDto } from './dtos/view-session.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateSessionDto } from './dtos/update-session.dto';
import { RoomsService } from '../rooms/rooms.service';
import { MoviesService } from '../movies/movies.service';
import { RoomEntity } from '../rooms/rooms.entity';
import { MovieEntity } from '../movies/movies.entity';

describe('SessionsController', () => {
  let sessionsController: SessionsController;
  let sessionsService: SessionsService;
  let sessionRepository: Repository<SessionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [
        SessionsService,
        {
          provide: getRepositoryToken(SessionEntity),
          useClass: Repository,
        },
        RoomsService,
        {
          provide: getRepositoryToken(RoomEntity),
          useClass: Repository,
        },
        MoviesService,
        {
          provide: getRepositoryToken(MovieEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    sessionsController = module.get<SessionsController>(SessionsController);
    sessionsService = module.get<SessionsService>(SessionsService);
    sessionRepository = module.get<Repository<SessionEntity>>(
      getRepositoryToken(SessionEntity),
    );
  });

  describe('createSession', () => {
    it('should create a new session', async () => {
      const createSessionDto: CreateSessionDto = {
        movieId: 1,
        roomId: 1,
        date: new Date(),
        timeSlot: TimeSlot.EighteenToTwenty,
      };
      const sessionEntity: SessionEntity = {
        id: 1,
        movieId: 0,
        roomId: 0,
        date: new Date(),
        timeSlot: TimeSlot.TenToTwelve,
      };
      jest
        .spyOn(sessionsService, 'create')
        .mockResolvedValueOnce(sessionEntity);

      const result = await sessionsController.createSession(createSessionDto);

      expect(result).toEqual(sessionEntity);
      expect(sessionsService.create).toHaveBeenCalledWith(createSessionDto);
    });
  });

  describe('findSession', () => {
    it('should find an existing session', async () => {
      const sessionId = '1';
      const viewSessionDTO: ViewSessionDto = {
        id: 0,
        movieName: 'Test Movie',
        minAge: 0,
        date: undefined,
        timeSlot: TimeSlot.TenToTwelve,
        roomName: '',
        capacity: 3,
      };
      jest
        .spyOn(sessionsService, 'findOneHydrated')
        .mockResolvedValueOnce(viewSessionDTO);

      const result = await sessionsController.findSession(sessionId);

      expect(result).toEqual(viewSessionDTO);
      expect(sessionsService.findOneHydrated).toHaveBeenCalledWith(
        parseInt(sessionId),
      );
    });

    it('should throw NotFoundException if session is not found', async () => {
      const sessionId = '1';
      jest
        .spyOn(sessionsService, 'findOneHydrated')
        .mockResolvedValueOnce(undefined);

      await expect(
        sessionsController.findSession(sessionId),
      ).rejects.toThrowError(NotFoundException);
      expect(sessionsService.findOneHydrated).toHaveBeenCalledWith(
        parseInt(sessionId),
      );
    });
  });

  describe('findAllSession', () => {
    it('should find all sessions', async () => {
      const sessions: SessionEntity[] = [
        {
          id: 1,
          movieId: 0,
          roomId: 0,
          date: new Date(),
          timeSlot: TimeSlot.TenToTwelve,
        },
      ];
      jest.spyOn(sessionsService, 'find').mockResolvedValueOnce(sessions);

      const result = await sessionsController.findAllSession();

      expect(result).toEqual(sessions);
      expect(sessionsService.find).toHaveBeenCalled();
    });
  });

  describe('removeSession', () => {
    it('should remove an existing session', async () => {
      const sessionId = '1';
      const removedSessionEntity: SessionEntity = {
        id: 1,
        movieId: 0,
        roomId: 0,
        date: new Date(),
        timeSlot: TimeSlot.TenToTwelve,
      };
      jest
        .spyOn(sessionsService, 'remove')
        .mockResolvedValueOnce(removedSessionEntity);

      const result = await sessionsController.removeSession(sessionId);

      expect(result).toEqual(removedSessionEntity);
      expect(sessionsService.remove).toHaveBeenCalledWith(parseInt(sessionId));
    });
  });

  describe('updateSession', () => {
    it('should update an existing session', async () => {
      const sessionId = '1';
      const updateSessionDto: UpdateSessionDto = {
        movieId: 1,
        roomId: 1,
        date: new Date(),
        timeSlot: TimeSlot.TenToTwelve,
      };
      const updatedSessionEntity: SessionEntity = {
        id: 1,
        movieId: 0,
        roomId: 0,
        date: new Date(),
        timeSlot: TimeSlot.TenToTwelve,
      };
      jest
        .spyOn(sessionsService, 'update')
        .mockResolvedValueOnce(updatedSessionEntity);

      const result = await sessionsController.updateSession(
        sessionId,
        updateSessionDto,
      );

      expect(result).toEqual(updatedSessionEntity);
      expect(sessionsService.update).toHaveBeenCalledWith(
        parseInt(sessionId),
        updateSessionDto,
      );
    });
  });
});
