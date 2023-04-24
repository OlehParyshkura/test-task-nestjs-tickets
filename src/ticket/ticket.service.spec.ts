import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { PrismaService } from '../prisma/prisma.service';
import { GlobalParameterService } from '../global-parameter/global-parameter.service';
import { ForbiddenException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

describe('TicketService', () => {
  let service: TicketService;

  const mockPrismaService = {
    ticket: {
      create: jest.fn((object) => {
        if (object.data) {
          return object.data;
        }
      }),
    },
  };

  const mockGlobalParameterService = {
    getByName(name) {
      if (name === 'SERVICE_FEE_RATE_PERCENT') {
        return 10;
      }
      if (name === 'MINIMUM_FEE') {
        return 5000;
      }
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        TicketService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: GlobalParameterService,
          useValue: mockGlobalParameterService,
        },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate ticket from buyerPrice', async () => {
    const result = await service.create({
      buyerPrice: 44000,
      promoterReceivesPrice: undefined,
    });

    expect(result).toStrictEqual({
      buyerPrice: 44000,
      promoterReceivesPrice: 39000,
      serviceFee: 5000,
    });
  });

  it('should calculate ticket from buyerPrice (service fee is higher than minimum fee)', async () => {
    const result = await service.create({
      buyerPrice: 55000,
      promoterReceivesPrice: undefined,
    });

    expect(result).toStrictEqual({
      buyerPrice: 55000,
      promoterReceivesPrice: 49500,
      serviceFee: 5500,
    });
  });

  it('should calculate ticket from promoterReceivesPrice', async () => {
    const result = await service.create({
      buyerPrice: undefined,
      promoterReceivesPrice: 39000,
    });

    expect(result).toStrictEqual({
      buyerPrice: 44000,
      promoterReceivesPrice: 39000,
      serviceFee: 5000,
    });
  });

  it('should calculate ticket from promoterReceivesPrice (service fee is higher than minimum fee)', async () => {
    const result = await service.create({
      buyerPrice: undefined,
      promoterReceivesPrice: 49500,
    });

    expect(result).toStrictEqual({
      buyerPrice: 55000,
      promoterReceivesPrice: 49500,
      serviceFee: 5500,
    });
  });

  it('should throw error if buyerPrice is less than minimum fee', async () => {
    await expect(
      service.create({
        buyerPrice: 4000,
        promoterReceivesPrice: undefined,
      }),
    ).rejects.toThrow(
      new ForbiddenException('Buyer price should not be less than minimum fee'),
    );
  });

  it('should ignore promoterReceivesPrice if buyerPrice is defined', async () => {
    const result = await service.create({
      buyerPrice: 60000,
      promoterReceivesPrice: 60000,
    });

    expect(result).toStrictEqual({
      buyerPrice: 60000,
      promoterReceivesPrice: 54000,
      serviceFee: 6000,
    });
  });
});
