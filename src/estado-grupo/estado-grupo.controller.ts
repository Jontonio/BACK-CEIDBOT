import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstadoGrupoService } from './estado-grupo.service';
import { CreateEstadoGrupoDto } from './dto/create-estado-grupo.dto';
import { UpdateEstadoGrupoDto } from './dto/update-estado-grupo.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estadoGrupoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstadoGrupoDto: UpdateEstadoGrupoDto) {
    return this.estadoGrupoService.update(+id, updateEstadoGrupoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estadoGrupoService.remove(+id);
  }
}
