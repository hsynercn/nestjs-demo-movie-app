import { Test, TestingModule } from '@nestjs/testing';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { TicketEntity } from './tickets.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
/*
describe('TicketsController', () => {
  let ticketsController: TicketsController;
  let ticketsService: TicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [
        TicketsService,
        {
          provide: getRepositoryToken(TicketEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    ticketsController = module.get<TicketsController>(TicketsController);
    ticketsService = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(ticketsController).toBeDefined();
  });
});
*/