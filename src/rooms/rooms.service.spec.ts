import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoomEntity } from './rooms.entity';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { NotFoundException } from '@nestjs/common';

describe('RoomsService', () => {
  let roomsService: RoomsService;
  let roomRepository: Repository<RoomEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: getRepositoryToken(RoomEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    roomsService = module.get<RoomsService>(RoomsService);
    roomRepository = module.get<Repository<RoomEntity>>(
      getRepositoryToken(RoomEntity),
    );
  });

  describe('create', () => {
    it('should create a new room', async () => {
      const newRoom: CreateRoomDto = { name: 'Test Room', capacity: 3 };
      const savedRoom: RoomEntity = { id: 1, ...newRoom };
      jest.spyOn(roomRepository, 'create').mockReturnValue(savedRoom);
      jest.spyOn(roomRepository, 'save').mockResolvedValue(savedRoom);

      const result = await roomsService.create(newRoom);

      expect(result).toEqual(savedRoom);
      expect(roomRepository.create).toHaveBeenCalledWith(newRoom);
      expect(roomRepository.save).toHaveBeenCalledWith(savedRoom);
    });
  });

  describe('findOne', () => {
    it('should return a room by ID', async () => {
      const roomId = 1;
      const foundRoom: RoomEntity = {
        id: roomId,
        name: 'Test Room',
        capacity: 3,
      };
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(foundRoom);

      const result = await roomsService.findOne(roomId);

      expect(result).toEqual(foundRoom);
      expect(roomRepository.findOne).toHaveBeenCalledWith({
        where: { id: roomId },
      });
    });
  });

  describe('find', () => {
    it('should return an array of rooms', async () => {
      const foundRooms: RoomEntity[] = [
        { id: 1, name: 'Test Room 1', capacity: 3 },
        { id: 2, name: 'Test Room 2', capacity: 3 },
      ];
      jest.spyOn(roomRepository, 'find').mockResolvedValue(foundRooms);

      const result = await roomsService.find();

      expect(result).toEqual(foundRooms);
      expect(roomRepository.find).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a room', async () => {
      const roomId = 1;
      const updateRoomDto: UpdateRoomDto = {
        name: 'Updated Room',
        capacity: 3,
      };
      const existingRoom: RoomEntity = {
        id: roomId,
        name: 'Room',
        capacity: 3,
      };
      const updatedRoom: RoomEntity = { id: roomId, ...updateRoomDto };
      jest.spyOn(roomsService, 'findOne').mockResolvedValue(existingRoom);
      jest.spyOn(roomRepository, 'save').mockResolvedValue(updatedRoom);

      const result = await roomsService.update(roomId, updateRoomDto);

      expect(result).toEqual(updatedRoom);
      expect(roomsService.findOne).toHaveBeenCalledWith(roomId);
      expect(roomRepository.save).toHaveBeenCalledWith(updatedRoom);
    });
    it('should throw NotFoundException if room is not found', async () => {
      const roomId = 1;
      const updateRoomDto: UpdateRoomDto = {
        name: 'Updated Room',
        capacity: 3,
      };
      jest.spyOn(roomsService, 'findOne').mockResolvedValue(null);

      await expect(roomsService.update(roomId, updateRoomDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(roomsService.findOne).toHaveBeenCalledWith(roomId);
    });
  });

  describe('remove', () => {
    it('should remove a room', async () => {
      const roomId = 1;
      const existingRoom: RoomEntity = {
        id: roomId,
        name: 'Room',
        capacity: 3,
      };
      jest.spyOn(roomsService, 'findOne').mockResolvedValue(existingRoom);
      jest.spyOn(roomRepository, 'remove').mockResolvedValue(existingRoom);

      const result = await roomsService.remove(roomId);

      expect(result).toEqual(existingRoom);
      expect(roomsService.findOne).toHaveBeenCalledWith(roomId);
      expect(roomRepository.remove).toHaveBeenCalledWith(existingRoom);
    });

    it('should throw NotFoundException if room is not found', async () => {
      const roomId = 1;
      jest.spyOn(roomsService, 'findOne').mockResolvedValue(null);

      await expect(roomsService.remove(roomId)).rejects.toThrow(
        NotFoundException,
      );
      expect(roomsService.findOne).toHaveBeenCalledWith(roomId);
    });
  });
});
