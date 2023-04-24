import { Injectable } from '@nestjs/common';
import { CreateGlobalParameterDto } from './dto/create-global-parameter.dto';
import { UpdateGlobalParameterDto } from './dto/update-global-parameter.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GlobalParameterService {
  constructor(private readonly prisma: PrismaService) {}

  create(createGlobalParameterDto: CreateGlobalParameterDto) {
    return this.prisma.globalParameters.create({
      data: createGlobalParameterDto,
    });
  }

  findAll() {
    return this.prisma.globalParameters.findMany();
  }

  findOne(id: number) {
    return this.prisma.globalParameters.findUnique({ where: { id } });
  }

  async getByName(name: string) {
    const entity = await this.prisma.globalParameters.findUnique({
      where: { name },
    });

    return entity.value;
  }

  update(id: number, updateGlobalParameterDto: UpdateGlobalParameterDto) {
    return this.prisma.globalParameters.update({
      where: { id },
      data: updateGlobalParameterDto,
    });
  }

  remove(id: number) {
    return this.prisma.globalParameters.delete({ where: { id } });
  }
}
