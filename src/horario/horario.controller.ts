import { Controller, Get, Post, Body } from '@nestjs/common';
import { HorarioService } from './horario.service';
import { CreateHorarioDto } from './dto/create-horario.dto';
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

  @Get('get-horarios-matricula')
  findAllHorarios() {
    return this.horarioService.findListHorarios();
  }

}
