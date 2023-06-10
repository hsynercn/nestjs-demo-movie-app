import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dtos/create-session.dto';
import { UpdateSessionDto } from './dtos/update-session.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../shared/roles.decorator';
import { UserRole } from '../shared/enums';

@Controller('sessions')
@ApiTags('sessions')
@ApiBearerAuth()
export class SessionsController {
  constructor(private sessionService: SessionsService) {}
  @Post()
  @Roles(UserRole.Admin)
  createSession(@Body() body: CreateSessionDto) {
    return this.sessionService.create(body);
  }
  @Get('/:id')
  @Roles(UserRole.Admin, UserRole.User)
  async findSession(@Param('id') id: string) {
    const session = await this.sessionService.findOneHydrated(parseInt(id));
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }
  @Get()
  @ApiQuery({ name: 'movieId', required: false, type: 'string' })
  @ApiQuery({ name: 'roomId', required: false, type: 'string' })
  @Roles(UserRole.Admin, UserRole.User)
  findAllSession(
    @Query('movieId') movieId?: string,
    @Query('roomId') roomId?: string,
  ) {
    return this.sessionService.find(parseInt(movieId), parseInt(roomId));
  }
  @Delete('/:id')
  @Roles(UserRole.Admin)
  removeSession(@Param('id') id: string) {
    return this.sessionService.remove(parseInt(id));
  }
  @Patch()
  @Roles(UserRole.Admin)
  updateSession(@Param('id') id: string, @Body() body: UpdateSessionDto) {
    return this.sessionService.update(parseInt(id), body);
  }
}
