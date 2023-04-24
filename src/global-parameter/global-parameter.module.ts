import { Global, Module } from '@nestjs/common';
import { GlobalParameterService } from './global-parameter.service';
import { GlobalParameterController } from './global-parameter.controller';

@Global()
@Module({
  controllers: [GlobalParameterController],
  providers: [GlobalParameterService],
  exports: [GlobalParameterService],
})
export class GlobalParameterModule {}
