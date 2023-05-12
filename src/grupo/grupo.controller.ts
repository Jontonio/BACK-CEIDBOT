import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GrupoService } from './grupo.service';
import { CreateTipoGrupoDto } from './dto/create-tipo-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoModuloDto } from './dto/update-grupo-modulo.dto';

@Controller('grupo')
export class GrupoController {
  
  constructor(private readonly grupoService: GrupoService) {}

  @Post('create-tipo-grupo')
  createTipoGrupo(@Body() createTipoGrupo: CreateTipoGrupoDto) {
    return this.grupoService.createTipoGrupo(createTipoGrupo);
  }

  @Post('create-grupo')
  createGrupo(@Body() createGrupo: CreateGrupoDto) {
    return this.grupoService.createGrupo(createGrupo);
  }

  @Get('get-tipo-grupos')
  findAllTipoGrupos(@Query() pagination: PaginationQueryDto) {
    return this.grupoService.findAllTipoGrupos(pagination);
  }

  @Get('get-grupos')
  findAllGrupos(@Query() pagination: PaginationQueryDto) {
    return this.grupoService.findAllGrupos(pagination);
  }

  @Get('get-grupos-matricula')
  findAllGruposMatricula(@Query() pagination: PaginationQueryDto) {
    return this.grupoService.findAllMatricula(pagination);
  }

  @Get('get-one-grupo/:id')
  findOneGrupo(@Param('id') id: string) {
    return this.grupoService.findOneGrupo(+id);
  }

  @Patch('update-grupo/:id')
  updateGrupo(@Param('id') id: string, @Body() updateGrupoDto: UpdateGrupoDto) {
    return this.grupoService.updateGrupo(+id, updateGrupoDto);
  }

  @Patch('update-grupo-modulo/:id')
  update(@Param('id') id: string, @Body() updateGrupoModuloDto: UpdateGrupoModuloDto) {
    return this.grupoService.updateGrupoModelo(+id, updateGrupoModuloDto);
  }

  @Delete('delete-grupo/:id')
  remove(@Param('id') id: string) {
    return this.grupoService.remove(+id);
  }
}
