import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GlobalParameterService } from '../global-parameter/global-parameter.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TicketService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly globalParameterService: GlobalParameterService,
    private readonly config: ConfigService,
  ) {}
  async create(createTicketDto: CreateTicketDto) {
    const ticket = await this.calculateTicket(createTicketDto);

    return this.prisma.ticket.create({ data: ticket });
  }

  findAll() {
    return this.prisma.ticket.findMany();
  }

  findOne(id: number) {
    return this.prisma.ticket.findUnique({ where: { id } });
  }

  async update(id: number, updateTicketDto: UpdateTicketDto) {
    const newTicket = await this.calculateTicket(updateTicketDto);
    return this.prisma.ticket.update({
      where: { id },
      data: newTicket,
    });
  }

  remove(id: number) {
    return this.prisma.ticket.delete({ where: { id } });
  }

  private async calculateTicket(dto: CreateTicketDto | UpdateTicketDto) {
    if (dto.buyerPrice) {
      return this.calculateTicketFromBuyerPrice(dto.buyerPrice);
    } else {
      return this.calculateTicketFromPromoterReceivesPrice(
        dto.promoterReceivesPrice,
      );
    }
  }

  private async getServiceFeeRatePercent(): Promise<number> {
    const SERVICE_FEE_RATE_PERCENT_DEFAULT = this.config.get(
      'SERVICE_FEE_RATE_PERCENT_DEFAULT',
    );

    try {
      const serviceFeeRatePercent = await this.globalParameterService.getByName(
        'SERVICE_FEE_RATE_PERCENT',
      );

      if (
        typeof serviceFeeRatePercent !== 'number' ||
        serviceFeeRatePercent >= 100 ||
        serviceFeeRatePercent < 0
      ) {
        return SERVICE_FEE_RATE_PERCENT_DEFAULT;
      }
      return serviceFeeRatePercent;
    } catch (e) {
      return SERVICE_FEE_RATE_PERCENT_DEFAULT;
    }
  }

  private async getMinimumFee(): Promise<number> {
    const MINIMUM_FEE_DEFAULT = this.config.get('MINIMUM_FEE_DEFAULT');

    try {
      const minimumFee = await this.globalParameterService.getByName(
        'MINIMUM_FEE',
      );
      if (typeof minimumFee !== 'number' || minimumFee < 0) {
        return MINIMUM_FEE_DEFAULT;
      }
      return minimumFee;
    } catch (e) {
      return MINIMUM_FEE_DEFAULT;
    }
  }

  private async calculateTicketFromBuyerPrice(buyerPrice: number) {
    const serviceFeeRatePercent = await this.getServiceFeeRatePercent();
    const minimumFee = await this.getMinimumFee();
    const serviceFeeRate = serviceFeeRatePercent / 100;

    if (buyerPrice < minimumFee) {
      throw new ForbiddenException(
        'Buyer price should not be less than minimum fee',
      );
    }
    let serviceFee;

    serviceFee = Math.ceil(buyerPrice * serviceFeeRate);
    serviceFee = Math.max(serviceFee, minimumFee);
    const promoterReceivesPrice = buyerPrice - serviceFee;

    return { serviceFee, buyerPrice, promoterReceivesPrice };
  }

  private async calculateTicketFromPromoterReceivesPrice(
    promoterReceivesPrice: number,
  ) {
    const serviceFeeRatePercent = await this.getServiceFeeRatePercent();
    const minimumFee = await this.getMinimumFee();
    const serviceFeeRate = serviceFeeRatePercent / 100;

    let serviceFee;
    let buyerPrice;

    buyerPrice = Math.ceil(promoterReceivesPrice / (1 - serviceFeeRate));
    serviceFee = buyerPrice - promoterReceivesPrice;
    if (serviceFee < minimumFee) {
      serviceFee = minimumFee;
      buyerPrice = promoterReceivesPrice + serviceFee;
    }

    return { serviceFee, buyerPrice, promoterReceivesPrice };
  }
}
