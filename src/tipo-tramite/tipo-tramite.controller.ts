import { Controller, Get, Post, Body } from '@nestjs/common';
import { TipoTramiteService } from './tipo-tramite.service';
import { CreateTipoTramiteDto } from './dto/create-tipo-tramite.dto';

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
}
