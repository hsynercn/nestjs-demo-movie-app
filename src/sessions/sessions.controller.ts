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
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dtos/create-session.dto';
import { UpdateSessionDto } from './dtos/update-session.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private sessionService: SessionsService) {}
  @Post()
  createSession(@Body() body: CreateSessionDto) {
    return this.sessionService.create(body);
  }
  @Get('/:id')
  async findSession(@Param('id') id: string) {
    const session = await this.sessionService.findOne(parseInt(id));
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }
  @Get()
  findAllSession() {
    return this.sessionService.find();
  }
  @Delete('/:id')
  removeSession(@Param('id') id: string) {
    console.log('id', id);
    return this.sessionService.remove(parseInt(id));
  }
  @Patch()
  updateSession(@Param('id') id: string, @Body() body: UpdateSessionDto) {
    return this.sessionService.update(parseInt(id), body);
  }
}
