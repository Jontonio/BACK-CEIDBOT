import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Controller('curso')
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @Post('add-curso')
  async create(@Body() createCursoDto: CreateCursoDto) {
    return this.cursoService.create(createCursoDto);
  }

  @Get('get-cursos')
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.cursoService.findAll(pagination);
  }

  @Get('get-cursos-inscripcion')
  findCursosInscripcion() {
    return this.cursoService.cursosInscripcion();
  }

  @Get('get-one-curso/:id')
  findOne(@Param('id') id: string) {
    return this.cursoService.findOne(+id);
  }

  @Patch('update-curso/:id')
  update(@Param('id') id: string, @Body() updateCursoDto: UpdateCursoDto) {
    return this.cursoService.update(+id, updateCursoDto);
  }

  @Delete('delete-curso/:id')
  remove(@Param('id') id: string) {
    return this.cursoService.remove(+id);
  }

  // getClientSomehow(req: Request): Socket{
  //   return req.socket;
  // }
}
