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

  @Patch('update-tipo-tramite/:id')
  update(@Param('id') id:string, @Body() updateTipoTramiteDto: UpdateTipoTramiteDto) {
    return this.tipoTramiteService.update(+id, updateTipoTramiteDto);
  }

  @Delete('delete-tipo-tramite/:id')
  delete(@Param('id') id:string) {
    return this.tipoTramiteService.delete(+id);
  }

  @Get('get-list-register')
  findAll() {
    return this.tipoTramiteService.findAll();
  }
}
