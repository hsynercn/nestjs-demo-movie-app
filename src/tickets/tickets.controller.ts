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
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { UpdateTicketDto } from './dtos/update-ticket.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../shared/roles.decorator';
import { UserRole } from '../shared/enums';

@Controller('tickets')
@ApiTags('tickets')
@ApiBearerAuth()
export class TicketsController {
  constructor(private ticketService: TicketsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Creates a new ticket for user, user age must be greater than movie age limit and session must have available capacity.',
  })
  @Roles(UserRole.Admin, UserRole.User)
  createTicket(@Body() body: CreateTicketDto) {
    return this.ticketService.create(body);
  }

  @Get()
  @Roles(UserRole.Admin)
  @ApiQuery({ name: 'userId', required: false, type: 'string' })
  @ApiQuery({ name: 'sessionId', required: false, type: 'string' })
  async findTickets(
    @Query('userId') userId?: string,
    @Query('sessionId') sessionId?: string,
  ) {
    return this.ticketService.find(parseInt(userId), parseInt(sessionId));
  }

  @Get('/:id')
  @Roles(UserRole.Admin, UserRole.User)
  async findTicket(@Param('id') id: string) {
    const ticket = await this.ticketService.findOneHydrated(parseInt(id));
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  @Delete('/:id')
  @Roles(UserRole.Admin)
  removeTicket(@Param('id') id: string) {
    return this.ticketService.remove(parseInt(id));
  }

  @Patch('/:id')
  @Roles(UserRole.Admin)
  updateTicket(@Param('id') id: string, @Body() body: UpdateTicketDto) {
    return this.ticketService.update(parseInt(id), body);
  }
}
