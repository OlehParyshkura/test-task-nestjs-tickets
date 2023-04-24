import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TicketModule } from './ticket/ticket.module';
import { PrismaModule } from './prisma/prisma.module';
import { GlobalParameterModule } from './global-parameter/global-parameter.module';

@Module({
  imports: [
    TicketModule,
    PrismaModule,
    GlobalParameterModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
