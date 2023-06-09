import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../shared/roles.decorator';
import { UserRole } from '../shared/enums';
@ApiBearerAuth()
@Roles(UserRole.Admin)
@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}
  @Post()
  createRoom(@Body() body: CreateRoomDto) {
    return this.roomsService.create(body);
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
