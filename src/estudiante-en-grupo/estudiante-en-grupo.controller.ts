import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EstudianteEnGrupoService } from './estudiante-en-grupo.service';
import { CreateEstudianteEnGrupoDto } from './dto/create-estudiante-en-grupo.dto';
import { UpdateEstudianteEnGrupoDto } from './dto/update-estudiante-en-grupo.dto';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';

@Controller('estudiante-en-grupo')
export class EstudianteEnGrupoController {
  constructor(private readonly estudianteEnGrupoService: EstudianteEnGrupoService) {}

  @Post('register-estudiante-prematricula')
  create(@Body() createEstudianteEnGrupoDto: CreateEstudianteEnGrupoDto) {
    return this.estudianteEnGrupoService.create(createEstudianteEnGrupoDto);
  }

  @Post('register-estudiante-from-matricula')
  registerFromMatricula(@Body() createEstudianteEnGrupoDto: CreateEstudianteEnGrupoDto) {
    return this.estudianteEnGrupoService.registerFromMatricula(createEstudianteEnGrupoDto);
  }

  @Get('get-estudiantes-en-grupo')
  findAll(@Query() pagination:PaginationQueryDto) {
    return this.estudianteEnGrupoService.findAll(pagination);
  }

  @Get('get-estudiantes-en-grupo-especifico/:id')
  findOne(@Param('id') id: string, @Query() pagination:PaginationQueryDto) {
    return this.estudianteEnGrupoService.findByIdGrupo(+id, pagination);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstudianteEnGrupoDto: UpdateEstudianteEnGrupoDto) {
    return this.estudianteEnGrupoService.update(+id, updateEstudianteEnGrupoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estudianteEnGrupoService.remove(+id);
  }
}
