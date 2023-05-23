import { Controller, Get, Post, Body, Patch, Delete, Param } from '@nestjs/common';
import { CategoriaPagoService } from './categoria-pago.service';
import { CreateCategoriaPagoDto } from './dto/create-categoria-pago.dto';
import { UpdateCategoriaPagoDto } from './dto/update-categoria-pago.dto';

@Controller('categoria-pago')
export class CategoriaPagoController {
  
  constructor(private readonly categoriaPagoService: CategoriaPagoService) {}

  @Get('get-all-categoria-pago')
  findAll() {
    return this.categoriaPagoService.findAll();
  }

  @Post('create-categoria-pago')
  createDenominService(@Body() createCategoriaPagoDto:CreateCategoriaPagoDto){
    return this.categoriaPagoService.create(createCategoriaPagoDto);
  }
  
  @Patch('update-categoria-pago/:id')
  updateDenominacionServicio(@Param('id') id:string, @Body() updateCategoriaPagoDto:UpdateCategoriaPagoDto){
    return this.categoriaPagoService.update(+id, updateCategoriaPagoDto);
  }

  @Delete('delete-categoria-pago/:id')
  deleteDenominacionServicio(@Param('id') id:string){
    return this.categoriaPagoService.delete(+id);
  }

}
