import { Controller, Post, Body, Patch, Param, Delete, Get } from '@nestjs/common';
import { PagoService } from './pago.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { CreateMoraPagoDto } from './dto/mora-pago.dto';

@Controller('pago')
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Post('register-pago')
  create(@Body() createPagoDto: CreatePagoDto) {
    return this.pagoService.create(createPagoDto);
  }

  @Post('register-mora')
  createMora(@Body() createMoraPagoDto: CreateMoraPagoDto) {
    return this.pagoService.createMora(createMoraPagoDto);
  }

  @Patch('update-one-pago/:id')
  update(@Param('id') id: string, @Body() updatePagoDto: UpdatePagoDto) {
    return this.pagoService.update(+id, updatePagoDto);
  }

  @Delete('delete-pago/:id')
  remove(@Param('id') id: string) {
    return this.pagoService.remove(+id);
  }

  @Patch('update-mora/:id')
  updateMora(@Param('id') id: string, @Body() updatePagoDto: UpdatePagoDto) {
    return this.pagoService.updateMora(+id, updatePagoDto);
  }

  @Delete('delete-mora/:id')
  removeMora(@Param('id') id: string) {
    return this.pagoService.deleteMora(+id);
  }
  
}
