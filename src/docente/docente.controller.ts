import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Res } from '@nestjs/common';
import { DocenteService } from './docente.service';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';

@Controller('docente')
export class DocenteController {
  constructor(private readonly docenteService: DocenteService) {}

  @Post('add-docente')
  create(@Body() createDocenteDto: CreateDocenteDto) {
    return this.docenteService.create(createDocenteDto);
  }

  @Get('get-docentes')
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.docenteService.findAll(pagination);
  }

  @Get('get-one-docente/:id')
  findOne(@Param('id') id: string) {
    return this.docenteService.findOne(+id);
  }

  @Patch('update-docente/:id')
  update(@Param('id') id: string, @Body() updateDocenteDto: UpdateDocenteDto) {
    return this.docenteService.update(+id, updateDocenteDto);
  }

  @Delete('delete-docente/:id')
  remove(@Param('id') id: string) {
    return this.docenteService.remove(+id);
  }

  @Post('/faker-docente')
  createFake(){
    return this.docenteService.addFakeData();
  }
}
