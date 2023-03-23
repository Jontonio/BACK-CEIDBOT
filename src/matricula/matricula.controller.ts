import { Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { MatriculaService } from './matricula.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';

@Controller('matricula')
export class MatriculaController {
  constructor(private readonly matriculaService: MatriculaService) {}

  @Post('matricular-estudiante')
  create(@Body() createMatriculaDto: CreateMatriculaDto) {
    return this.matriculaService.create(createMatriculaDto);
  }

  @Get('get-matriculas-estudiantes')
  findAll(@Query() pagination:PaginationQueryDto ) {
    return this.matriculaService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matriculaService.findOne(+id);
  }

  @Delete('remove-matriculado/:id')
  remove(@Param('id') id: string) {
    return this.matriculaService.remove(+id);
  }
}
