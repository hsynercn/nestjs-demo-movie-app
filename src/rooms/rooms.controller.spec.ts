import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoomEntity } from './rooms.entity';
import { CreateRoomDto } from './dtos/create-room.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateRoomDto } from './dtos/update-room.dto';

describe('RoomsController', () => {
  let roomsController: RoomsController;
  let roomsService: RoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [
        RoomsService,
        {
          provide: getRepositoryToken(RoomEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    roomsController = module.get<RoomsController>(RoomsController);
    roomsService = module.get<RoomsService>(RoomsService);
  });

  describe('createRoom', () => {
    it('should create a new room', async () => {
      const newRoom: CreateRoomDto = { name: 'Test Room', capacity: 3 };
      const createdRoom = { id: 1, ...newRoom };
      jest.spyOn(roomsService, 'create').mockResolvedValue(createdRoom);

      const result = await roomsController.createRoom(newRoom);

      expect(result).toEqual(createdRoom);
      expect(roomsService.create).toHaveBeenCalledWith(newRoom);
    });
  });

  describe('findRoom', () => {
    it('should return a room by ID', async () => {
      const roomId = '1';
      const room: RoomEntity = { id: 1, name: 'Test Room', capacity: 3 };
      jest
        .spyOn(roomsService, 'findOne')
        .mockImplementation(() => Promise.resolve(room));

      expect(await roomsController.findRoom(roomId)).toEqual(room);
    });

    it('should throw NotFoundException if room is not found', async () => {
      const roomId = '1';
      jest
        .spyOn(roomsService, 'findOne')
        .mockImplementation(() => Promise.resolve(undefined));

      await expect(roomsController.findRoom(roomId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('findAllRooms', () => {
    it('should return an array of rooms', () => {
      const rooms: RoomEntity[] = [
        { id: 1, name: 'Test Room 1', capacity: 3 },
        { id: 2, name: 'Test Room 2', capacity: 5 },
      ];
      jest
        .spyOn(roomsService, 'find')
        .mockImplementation(() => Promise.resolve(rooms));

      expect(roomsController.findAllRooms()).resolves.toEqual(rooms);
    });
  });

  describe('removeRoom', () => {
    it('should remove a room by ID', async () => {
      const roomId = '1';

      jest.spyOn(roomsService, 'remove').mockResolvedValueOnce(undefined);

      const result = await roomsController.removeRoom(roomId);

      expect(roomsService.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });

  describe('updateRoom', () => {
    it('should update a room', async () => {
      const roomId = '1';
      const updateRoomDto: UpdateRoomDto = {
        name: 'Updated Room',
        capacity: 4,
      };
      const updatedRoom: RoomEntity = {
        id: 1,
        name: 'Updated Room',
        capacity: 4,
      };

      jest.spyOn(roomsService, 'update').mockResolvedValueOnce(updatedRoom);

      const result = await roomsController.updateRoom(roomId, updateRoomDto);

      expect(roomsService.update).toHaveBeenCalledWith(1, updateRoomDto);
      expect(result).toEqual(updatedRoom);
    });
  });
});
