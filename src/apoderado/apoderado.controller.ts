import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApoderadoService } from './apoderado.service';
import { CreateApoderadoDto } from './dto/create-apoderado.dto';

@Controller('apoderado')
export class ApoderadoController {
  constructor(private readonly apoderadoService: ApoderadoService) {}

  @Post('create-apoderado')
  create(@Body() createApoderadoDto: CreateApoderadoDto) {
    return this.apoderadoService.create(createApoderadoDto);
  }

  @Get('get-one-apoderado/:DNI')
  findOne(@Param('DNI') DNI: string) {
    return this.apoderadoService.findOne(DNI);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apoderadoService.remove(+id);
  }
}
