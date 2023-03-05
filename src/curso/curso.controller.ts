import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Req } from '@nestjs/common/decorators';
import { Request } from 'express';

@Controller('curso')
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @Post('/add-curso')
  async create(@Body() createCursoDto: CreateCursoDto, @Req() req:Request) {
    const resul = await this.cursoService.create(createCursoDto);
    return resul;
  }

  @Get('/get-cursos')
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.cursoService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCursoDto: UpdateCursoDto) {
    return this.cursoService.update(+id, updateCursoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cursoService.remove(+id);
  }

  // getClientSomehow(req: Request): Socket{
  //   return req.socket;
  // }
}
