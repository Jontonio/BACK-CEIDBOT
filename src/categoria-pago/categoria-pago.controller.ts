import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriaPagoService } from './categoria-pago.service';
import { CreateCategoriaPagoDto } from './dto/create-categoria-pago.dto';
import { UpdateCategoriaPagoDto } from './dto/update-categoria-pago.dto';

@Controller('categoria-pago')
export class CategoriaPagoController {
  
  constructor(private readonly categoriaPagoService: CategoriaPagoService) {}

  @Post()
  create(@Body() createCategoriaPagoDto: CreateCategoriaPagoDto) {
    return this.categoriaPagoService.create(createCategoriaPagoDto);
  }

  @Get('get-all-categoria-pago')
  findAll() {
    return this.categoriaPagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaPagoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoriaPagoDto: UpdateCategoriaPagoDto) {
    return this.categoriaPagoService.update(+id, updateCategoriaPagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriaPagoService.remove(+id);
  }
}
