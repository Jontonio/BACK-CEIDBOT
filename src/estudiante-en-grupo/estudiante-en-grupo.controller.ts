import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EstudianteEnGrupoService } from './estudiante-en-grupo.service';
import { EstudianteEnGrupoWithPagoDto } from './dto/create-estudiante-en-grupo-with-pago.dto';
import { EstudianteEnGrupoWithOutPagoDto } from './dto/create-estudiante-en-grupo-without-pago.dto';
import { UpdateEstudianteEnGrupoDto } from './dto/update-estudiante-en-grupo.dto';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { EstudianteDataDto } from './dto/estudiante-data.dto';

@Controller('estudiante-en-grupo')
export class EstudianteEnGrupoController {
  constructor(private readonly estudianteEnGrupoService: EstudianteEnGrupoService) {}

  @Post('register-estudiante-prematricula')
  create(@Body() createEstudianteEnGrupoDto: EstudianteEnGrupoWithOutPagoDto) {
    return this.estudianteEnGrupoService.create(createEstudianteEnGrupoDto);
  }

  @Post('consulta-estudiante-en-grupo')
  findEstudianteEnGrupo(@Body() estudianteDataDto: EstudianteDataDto) {
    return this.estudianteEnGrupoService.findEstudianteEnGrupo(estudianteDataDto);
  }

  @Post('register-estudiante-from-matricula')
  registerFromMatricula(@Body() createEstudianteEnGrupoDto: EstudianteEnGrupoWithPagoDto) {
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
