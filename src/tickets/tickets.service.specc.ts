import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TicketEntity } from './tickets.entity';
import { Repository } from 'typeorm';
import { SessionsService } from '../sessions/sessions.service';
import { UsersService } from '../users/users.service';

describe('TicketsService', () => {
  let ticketsService: TicketsService;
  let sessionsService: SessionsService;
  let usersService: UsersService;
  let ticketRepository: Repository<TicketEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: SessionsService,
          useValue: {
            findOneHydrated: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOneWithId: jest.fn(),
          },
        },
        {
          provide: Repository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    ticketsService = moduleRef.get<TicketsService>(TicketsService);
    sessionsService = moduleRef.get<SessionsService>(SessionsService);
    usersService = moduleRef.get<UsersService>(UsersService);
    ticketRepository = moduleRef.get<Repository<TicketEntity>>(Repository);
  });

  it('should be defined', () => {
    expect(ticketsService).toBeDefined();
  });
});
