import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service';
import { SessionEntity } from './sessions.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoomsService } from '../rooms/rooms.service';
import { MoviesService } from '../movies/movies.service';
import { RoomEntity } from '../rooms/rooms.entity';
import { MovieEntity } from '../movies/movies.entity';
import { TimeSlot } from '../shared/enums';
import { ViewSessionDto } from './dtos/view-session.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dtos/create-session.dto';

describe('SessionsService', () => {
  let sessionsService: SessionsService;
  let sessionRepository: Repository<SessionEntity>;

  let roomsService: RoomsService;

  let moviesService: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    roomsService = module.get<RoomsService>(RoomsService);

    moviesService = module.get<MoviesService>(MoviesService);

    sessionsService = module.get<SessionsService>(SessionsService);
    sessionRepository = module.get<Repository<SessionEntity>>(
      getRepositoryToken(SessionEntity),
    );
  });

  describe('findOne', () => {
    it('should return a session by id', async () => {
      const sessionEntity: SessionEntity = {
        id: 1,
        movieId: 0,
        roomId: 0,
        date: new Date(),
        timeSlot: TimeSlot.TenToTwelve,
      };
      jest
        .spyOn(sessionRepository, 'findOne')
        .mockResolvedValueOnce(sessionEntity);

      const result = await sessionsService.findOne(1);

      expect(result).toEqual(sessionEntity);
      expect(sessionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('findOneHydrated', () => {
    it('should return a hydrated view session DTO by id', async () => {
      const sessionDate = new Date('2023-06-09');
      const sessionId = 11,
        roomId = 21,
        movieId = 33;
      const sessionEntity: SessionEntity = {
        id: sessionId,
        roomId: roomId,
        movieId: movieId,
        date: sessionDate,
        timeSlot: TimeSlot.EighteenToTwenty,
      };
      const roomEntity: RoomEntity = {
        id: roomId,
        name: 'Room 1',
        capacity: 100,
      };
      const movieEntity: MovieEntity = {
        id: movieId,
        name: 'Movie 1',
        minAge: 12,
      };
      const expectedViewSessionDto: ViewSessionDto = {
        id: sessionId,
        movieName: 'Movie 1',
        minAge: 12,
        roomName: 'Room 1',
        date: sessionDate,
        timeSlot: TimeSlot.EighteenToTwenty,
        capacity: 100,
      };
      jest
        .spyOn(sessionsService, 'findOne')
        .mockResolvedValueOnce(sessionEntity);
      jest.spyOn(roomsService, 'findOne').mockResolvedValueOnce(roomEntity);
      jest.spyOn(moviesService, 'findOne').mockResolvedValueOnce(movieEntity);

      const result = await sessionsService.findOneHydrated(sessionId);

      expect(result).toEqual(expectedViewSessionDto);
      expect(sessionsService.findOne).toHaveBeenCalledWith(sessionId);
      expect(roomsService.findOne).toHaveBeenCalledWith(roomId);
      expect(moviesService.findOne).toHaveBeenCalledWith(movieId);
    });

    it('should throw NotFoundException if session not found', async () => {
      jest.spyOn(sessionsService, 'findOne').mockResolvedValueOnce(undefined);

      await expect(sessionsService.findOneHydrated(1)).rejects.toThrowError(
        NotFoundException,
      );
      expect(sessionsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findWithMovie', () => {
    it('should return an array of sessions with the given movieId', async () => {
      const sessionEntities: SessionEntity[] = [
        {
          id: 1,
          roomId: 1,
          movieId: 1,
          date: new Date(),
          timeSlot: TimeSlot.EighteenToTwenty,
        },
        {
          id: 2,
          roomId: 2,
          movieId: 2,
          date: new Date(),
          timeSlot: TimeSlot.EighteenToTwenty,
        },
      ];
      jest
        .spyOn(sessionRepository, 'find')
        .mockResolvedValueOnce(sessionEntities);
      const result = await sessionsService.findWithMovie(1);

      expect(result).toEqual(sessionEntities);
      expect(sessionRepository.find).toHaveBeenCalledWith({
        where: { movieId: 1 },
      });
    });
  });

  describe('findWithRoom', () => {
    it('should return an array of sessions with the given roomId', async () => {
      const sessionEntities: SessionEntity[] = [
        {
          id: 1,
          roomId: 1,
          movieId: 1,
          date: new Date(),
          timeSlot: TimeSlot.EighteenToTwenty,
        },
        {
          id: 2,
          roomId: 2,
          movieId: 2,
          date: new Date(),
          timeSlot: TimeSlot.EighteenToTwenty,
        },
      ];
      jest
        .spyOn(sessionRepository, 'find')
        .mockResolvedValueOnce(sessionEntities);
      const result = await sessionsService.findWithRoom(1);

      expect(result).toEqual(sessionEntities);
      expect(sessionRepository.find).toHaveBeenCalledWith({
        where: { roomId: 1 },
      });
    });
  });

  describe('create', () => {
    it('should create a new session', async () => {
      const newSessionDto: CreateSessionDto = {
        roomId: 1,
        movieId: 1,
        date: new Date('2023-06-10'),
        timeSlot: TimeSlot.EighteenToTwenty,
      };
      const roomEntity: RoomEntity = {
        id: 1,
        name: 'Room 1',
        capacity: 100,
      };
      const movieEntity: MovieEntity = {
        id: 1,
        name: 'Movie 1',
        minAge: 12,
      };

      const sessionEntity: SessionEntity = {
        id: 1,
        movieId: 0,
        roomId: 0,
        date: new Date(),
        timeSlot: TimeSlot.TenToTwelve,
      };

      jest.spyOn(roomsService, 'findOne').mockResolvedValueOnce(roomEntity);
      jest.spyOn(moviesService, 'findOne').mockResolvedValueOnce(movieEntity);
      jest
        .spyOn(sessionsService, 'findConflictingSessions')
        .mockResolvedValueOnce([]);
      jest
        .spyOn(sessionRepository, 'create')
        .mockReturnValueOnce(sessionEntity);
      jest
        .spyOn(sessionRepository, 'save')
        .mockResolvedValueOnce(sessionEntity);
      const result = await sessionsService.create(newSessionDto);

      expect(result).toEqual(sessionEntity);
      expect(roomsService.findOne).toHaveBeenCalledWith(1);
      expect(moviesService.findOne).toHaveBeenCalledWith(1);
      expect(sessionsService.findConflictingSessions).toHaveBeenCalledWith(
        newSessionDto,
      );
      expect(sessionRepository.create).toHaveBeenCalledWith(newSessionDto);
      expect(sessionRepository.save).toHaveBeenCalledWith(sessionEntity);
    });
    it('should throw BadRequestException if room is not found', async () => {
      const newSessionDto: CreateSessionDto = {
        roomId: 1,
        movieId: 1,
        date: new Date('2023-06-10'),
        timeSlot: TimeSlot.EighteenToTwenty,
      };
      jest.spyOn(roomsService, 'findOne').mockResolvedValueOnce(undefined);

      await expect(sessionsService.create(newSessionDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
    it('should throw BadRequestException if movie is not found', async () => {
      const newSessionDto: CreateSessionDto = {
        roomId: 1,
        movieId: 1,
        date: new Date('2023-06-10'),
        timeSlot: TimeSlot.EighteenToTwenty,
      };
      const roomEntity: RoomEntity = {
        id: 1,
        name: 'Room 1',
        capacity: 100,
      };
      jest.spyOn(roomsService, 'findOne').mockResolvedValueOnce(roomEntity);
      jest.spyOn(moviesService, 'findOne').mockResolvedValueOnce(undefined);

      await expect(sessionsService.create(newSessionDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
    it('should throw BadRequestException if conflicting session exists', async () => {
      const newSessionDto: CreateSessionDto = {
        roomId: 1,
        movieId: 1,
        date: new Date('2023-06-10'),
        timeSlot: TimeSlot.EighteenToTwenty,
      };
      const roomEntity: RoomEntity = {
        id: 1,
        name: 'Room 1',
        capacity: 100,
      };
      const movieEntity: MovieEntity = {
        id: 1,
        name: 'Movie 1',
        minAge: 12,
      };
      const conflictingSession: SessionEntity[] = [
        {
          id: 9,
          roomId: 1,
          movieId: 1,
          date: new Date('2023-06-10'),
          timeSlot: TimeSlot.EighteenToTwenty,
        },
      ];
      jest.spyOn(roomsService, 'findOne').mockResolvedValueOnce(roomEntity);
      jest.spyOn(moviesService, 'findOne').mockResolvedValueOnce(movieEntity);
      jest
        .spyOn(sessionsService, 'findConflictingSessions')
        .mockResolvedValueOnce(conflictingSession);

      await expect(sessionsService.create(newSessionDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
});
