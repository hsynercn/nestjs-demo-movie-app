import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}
  @Post()
  createRoom(@Body() body: CreateRoomDto) {
    console.log('body', body);
    this.roomsService.create(body);
  }

  @Get('/:id')
  async findRoom(@Param('id') id: string) {
    const room = await this.roomsService.findOne(parseInt(id));
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }

  @Get()
  findAllRooms() {
    return this.roomsService.find();
  }

  @Delete('/:id')
  removeRoom(@Param('id') id: string) {
    return this.roomsService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateRoom(@Param('id') id: string, @Body() body: UpdateRoomDto) {
    return this.roomsService.update(parseInt(id), body);
  }
}
