import { Body, Controller, Get, Param, Patch, Post, Query, Delete } from '@nestjs/common';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { DenominacionServicioService } from './denominacion-servicio.service';
import { CreateDenominServicioDto } from './dto/create-denomin-servicio.dto';
import { UpdateDenominServicioDto } from './entities/update-denominacion-servicio.dto';

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

  @Patch('update-denomin-servicio/:id')
  updateDenominacionServicio(@Param('id') id:string, @Body() updateDenominServicioDto:UpdateDenominServicioDto){
    return this.denominServicioService.update(+id, updateDenominServicioDto);
  }

  @Delete('delete-denomin-servicio/:id')
  deleteDenominacionServicio(@Param('id') id:string){
    return this.denominServicioService.delete(+id);
  }

}
