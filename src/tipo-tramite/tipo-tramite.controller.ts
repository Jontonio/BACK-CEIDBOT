import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoTramiteService } from './tipo-tramite.service';
import { CreateTipoTramiteDto } from './dto/create-tipo-tramite.dto';
import { UpdateTipoTramiteDto } from './dto/update-tipo-tramite.dto';

@Controller('tipo-tramite')
export class TipoTramiteController {
  constructor(private readonly tipoTramiteService: TipoTramiteService) {}

  @Post('register-tipo-tramite')
  create(@Body() createTipoTramiteDto: CreateTipoTramiteDto) {
    return this.tipoTramiteService.create(createTipoTramiteDto);
  }

  @Get('get-list-register')
  findAll() {
    return this.tipoTramiteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoTramiteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoTramiteDto: UpdateTipoTramiteDto) {
    return this.tipoTramiteService.update(+id, updateTipoTramiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoTramiteService.remove(+id);
  }
}
