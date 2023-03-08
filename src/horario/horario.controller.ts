import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HorarioService } from './horario.service';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { Query } from '@nestjs/common/decorators';

@Controller('horario')
export class HorarioController {
  constructor(private readonly horarioService: HorarioService) {}

  @Post('create-horario')
  create(@Body() createHorarioDto: CreateHorarioDto) {
    return this.horarioService.create(createHorarioDto);
  }

  @Get('get-horarios')
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.horarioService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.horarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHorarioDto: UpdateHorarioDto) {
    return this.horarioService.update(+id, updateHorarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.horarioService.remove(+id);
  }
}
