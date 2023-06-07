import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm/repository/Repository';
import { TicketEntity } from './tickets.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { RoomsService } from 'src/rooms/rooms.service';
import { MoviesService } from 'src/movies/movies.service';
import { SessionsService } from 'src/sessions/sessions.service';
import { ViewTicketDto } from './dtos/view-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(TicketEntity)
    private ticketRepository: Repository<TicketEntity>,
    private roomsService: RoomsService,
    private moviesService: MoviesService,
    private sessionsService: SessionsService,
  ) {}
  async create(newTicket: CreateTicketDto) {
    //TODO: Add user id check and AGE check after implementing user module
    const session = await this.sessionsService.findOne(newTicket.sessionId);
    if (!session) {
      throw new BadRequestException('Session not found');
    }
    const tickets = await this.ticketRepository.find({
      where: { sessionId: newTicket.sessionId },
    });
    const roomCapacity = await this.roomsService.findOne(session.roomId);
    if (tickets.length >= roomCapacity.capacity) {
      throw new BadRequestException('Session room is full');
    }
    const ticket = this.ticketRepository.create({ ...newTicket });
    return this.ticketRepository.save(ticket);
  }

  findOne(sessionId: number) {
    return this.ticketRepository.findOne({ where: { sessionId } });
  }

  findSessionTickets(sessionId: number) {
    return this.ticketRepository.find({ where: { sessionId } });
  }

  async findOneHydrated(sessionId: number) {
    const ticket = await this.findOne(sessionId);
    if (!ticket) {
      throw new BadRequestException('Ticket not found');
    }
    const session = await this.sessionsService.findOne(ticket.sessionId);
    const room = await this.roomsService.findOne(session.roomId);
    const movie = await this.moviesService.findOne(session.movieId);
    const hydratedViewTicketDto: ViewTicketDto = {
      id: ticket.id,
      userId: ticket.userId,
      sessionId: ticket.sessionId,
      movieName: movie.name,
      roomName: room.name,
      date: session.date,
      timeSlot: session.timeSlot,
    };
    return hydratedViewTicketDto;
  }
}
