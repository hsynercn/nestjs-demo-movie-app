import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm/repository/Repository';
import { TicketEntity } from './tickets.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { SessionsService } from 'src/sessions/sessions.service';
import { ViewTicketDto } from './dtos/view-ticket.dto';
import { TicketState } from 'src/shared/enums';
import { UpdateTicketDto } from './dtos/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(TicketEntity)
    private ticketRepository: Repository<TicketEntity>,
    private sessionsService: SessionsService,
  ) {}
  async create(newTicket: CreateTicketDto) {
    //TODO: Add user id check and AGE check after implementing user module
    const session = await this.sessionsService.findOne(newTicket.sessionId);
    if (!session) {
      throw new BadRequestException('Session not found');
    }
    const isCapacityFull = await this.capacityCheck(newTicket);
    if (isCapacityFull) {
      throw new BadRequestException('Session room is full');
    }
    const ticket = this.ticketRepository.create({
      ...newTicket,
      state: TicketState.Booked,
    });
    return this.ticketRepository.save(ticket);
  }

  private async capacityCheck(newTicket: CreateTicketDto) {
    const hydratedSession = await this.sessionsService.findOneHydrated(
      newTicket.sessionId,
    );
    const tickets = await this.ticketRepository.find({
      where: { sessionId: newTicket.sessionId },
    });
    const roomCapacity = hydratedSession.capacity;
    const isCapacityFull = tickets.length >= roomCapacity;
    return isCapacityFull;
  }

  findOne(id: number) {
    return this.ticketRepository.findOne({ where: { id } });
  }

  async find(userId?: number, sessionId?: number) {
    const query = this.ticketRepository.createQueryBuilder('ticket');
    if (userId) {
      query.andWhere('ticket.userId = :userId', { userId });
    }
    if (sessionId) {
      query.andWhere('ticket.sessionId = :sessionId', { sessionId });
    }
    return await query.getMany();
  }

  findSessionTickets(sessionId: number) {
    return this.ticketRepository.find({ where: { sessionId } });
  }

  async findSessionTicketsCount(sessionId: number) {
    return await this.ticketRepository.count({ where: { sessionId } });
  }

  async findUserTicketsHydrated(userId: number) {
    const tickets = await this.ticketRepository.find({
      where: { userId: userId },
    });
    const hydratedTickets: ViewTicketDto[] = [];
    await Promise.allSettled(
      tickets.map(async (ticket) => {
        const hydratedSession = await this.findOneHydrated(ticket.sessionId);
        const hydratedViewTicketDto: ViewTicketDto = {
          id: ticket.id,
          userId: ticket.userId,
          sessionId: ticket.sessionId,
          date: hydratedSession.date,
          timeSlot: hydratedSession.timeSlot,
          movieName: hydratedSession.movieName,
          roomName: hydratedSession.roomName,
          state: ticket.state,
        };
        hydratedTickets.push(hydratedViewTicketDto);
      }),
    );
    return hydratedTickets;
  }

  async update(id: number, updateTicket: UpdateTicketDto) {
    const ticket = await this.findOne(id);
    if (!ticket) {
      throw new BadRequestException('Ticket not found');
    }

    const allowedStateChanges = new Map<TicketState, Set<TicketState>>();
    allowedStateChanges.set(
      TicketState.Booked,
      new Set([TicketState.Canceled, TicketState.Used]),
    );
    if (!allowedStateChanges.get(ticket.state)?.has(updateTicket.state)) {
      throw new BadRequestException('Invalid state change');
    }

    Object.assign(ticket, updateTicket);
    return this.ticketRepository.save(ticket);
  }

  async remove(id: number) {
    const ticket = await this.findOne(id);
    if (!ticket) {
      throw new BadRequestException('Ticket not found');
    }
    return this.ticketRepository.remove(ticket);
  }

  async findOneHydrated(ticketId: number) {
    const ticket = await this.findOne(ticketId);
    if (!ticket) {
      throw new BadRequestException('Ticket not found');
    }
    const hydratedSession = await this.sessionsService.findOneHydrated(
      ticket.sessionId,
    );
    const hydratedViewTicketDto: ViewTicketDto = {
      id: ticket.id,
      userId: ticket.userId,
      sessionId: ticket.sessionId,
      date: hydratedSession.date,
      timeSlot: hydratedSession.timeSlot,
      movieName: hydratedSession.movieName,
      roomName: hydratedSession.roomName,
      state: ticket.state,
    };
    return hydratedViewTicketDto;
  }
}
