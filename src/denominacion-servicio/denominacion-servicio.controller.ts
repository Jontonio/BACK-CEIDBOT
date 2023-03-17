import { Body, Controller, Get, Post, Query} from '@nestjs/common';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { DenominacionServicioService } from './denominacion-servicio.service';
import { CreateDenominServicioDto } from './dto/create-denomin-servicio.dto';

@Controller('denomin-servicio')
export class DenominacionServicioController {
  constructor(private readonly denominServicioService: DenominacionServicioService) {}

  @Post('create-denomin-servicio')
  createDenominService(@Body() denominDto:CreateDenominServicioDto){
    return this.denominServicioService.create(denominDto);
  }
  
  @Get('get-lista-denomin-servicios')
  GetDenominacionServicio(@Query() pagination:PaginationQueryDto){
    return this.denominServicioService.getListDenominacionServicio(pagination);
  }

}
