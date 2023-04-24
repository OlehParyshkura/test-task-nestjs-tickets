import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GlobalParameterService } from './global-parameter.service';
import { CreateGlobalParameterDto } from './dto/create-global-parameter.dto';
import { UpdateGlobalParameterDto } from './dto/update-global-parameter.dto';

@Controller('global-parameters')
export class GlobalParameterController {
  constructor(
    private readonly globalParameterService: GlobalParameterService,
  ) {}

  @Post()
  create(@Body() createGlobalParameterDto: CreateGlobalParameterDto) {
    return this.globalParameterService.create(createGlobalParameterDto);
  }

  @Get()
  findAll() {
    return this.globalParameterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.globalParameterService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGlobalParameterDto: UpdateGlobalParameterDto,
  ) {
    return this.globalParameterService.update(+id, updateGlobalParameterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.globalParameterService.remove(+id);
  }
}
