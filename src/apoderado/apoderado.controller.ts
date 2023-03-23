import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApoderadoService } from './apoderado.service';
import { CreateApoderadoDto } from './dto/create-apoderado.dto';
import { UpdateApoderadoDto } from './dto/update-apoderado.dto';

@Controller('apoderado')
export class ApoderadoController {
  constructor(private readonly apoderadoService: ApoderadoService) {}

  @Post('create-apoderado')
  create(@Body() createApoderadoDto: CreateApoderadoDto) {
    return this.apoderadoService.create(createApoderadoDto);
  }

  @Get()
  findAll() {
    return this.apoderadoService.findAll();
  }

  @Get('get-one-apoderado/:DNI')
  findOne(@Param('DNI') DNI: string) {
    return this.apoderadoService.findOne(DNI);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApoderadoDto: UpdateApoderadoDto) {
    return this.apoderadoService.update(+id, updateApoderadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apoderadoService.remove(+id);
  }
}
