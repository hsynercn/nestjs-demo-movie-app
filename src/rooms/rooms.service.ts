import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from './rooms.entity';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  create(newRoom: CreateRoomDto) {
    const movie = this.roomRepository.create({ ...newRoom });
    return this.roomRepository.save(movie);
  }

  findOne(id: number) {
    return this.roomRepository.findOne({ where: { id } });
  }

  find() {
    return this.roomRepository.find();
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const room = await this.findOne(id);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    Object.assign(room, updateRoomDto);
    return this.roomRepository.save(room);
  }

  async remove(id: number) {
    const room = await this.findOne(id);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return this.roomRepository.remove(room);
  }
}
