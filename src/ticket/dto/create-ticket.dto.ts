import {
  IsOptional,
  IsNotEmpty,
  IsInt,
  ValidateIf,
  Min,
} from 'class-validator';

export class CreateTicketDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  buyerPrice: number;

  @ValidateIf(
    (ticketDtoObject: CreateTicketDto) => !Boolean(ticketDtoObject.buyerPrice),
  )
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  promoterReceivesPrice: number;
}
