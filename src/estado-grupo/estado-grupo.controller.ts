import { Controller, Get, Post, Body } from '@nestjs/common';
import { EstadoGrupoService } from './estado-grupo.service';
import { CreateEstadoGrupoDto } from './dto/create-estado-grupo.dto';

@Controller('estado-grupo')
export class EstadoGrupoController {
  constructor(private readonly estadoGrupoService: EstadoGrupoService) {}

  @Post('create-estado-grupo')
  create(@Body() createEstadoGrupoDto: CreateEstadoGrupoDto) {
    return this.estadoGrupoService.create(createEstadoGrupoDto);
  }

  @Get('get-lista-estados')
  findAll() {
    return this.estadoGrupoService.findAll();
  }

}
