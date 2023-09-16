import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PagoService } from './pago.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { CreateMoraPagoDto } from './dto/mora-pago.dto';

@Controller('pago')
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  // El decorador @Post('register-pago')` ruta POST para registrar un nuevo "pago"
  @Post('register-pago')
  create(@Body() createPagoDto: CreatePagoDto) {
    return this.pagoService.create(createPagoDto);
  }
  // El decorador @Post('register-mora')` ruta POST para registrar un nueva "mora"
  @Post('register-mora')
  createMora(@Body() createMoraPagoDto: CreateMoraPagoDto) {
    return this.pagoService.createMora(createMoraPagoDto);
  }
  // El decorador @update('update-one-pago/:id')` ruta Patch para actualizar un "pago"
  @Patch('update-one-pago/:id')
  update(@Param('id') id: string, @Body() updatePagoDto: UpdatePagoDto) {
    return this.pagoService.update(+id, updatePagoDto);
  }
  // El decorador @Delete('delete-pago/:id')` ruta Delete para eliminar un "pago"
  @Delete('delete-pago/:id')
  remove(@Param('id') id: string) {
    return this.pagoService.remove(+id);
  }
  // El decorador @Patch('update-mora/:id')` ruta Patch para actualizar una "mora"
  @Patch('update-mora/:id')
  updateMora(@Param('id') id: string, @Body() updatePagoDto: UpdatePagoDto) {
    return this.pagoService.updateMora(+id, updatePagoDto);
  }
  // El decorador @Delete('delete-mora/:id')` ruta Patch para eliminar una "mora"
  @Delete('delete-mora/:id')
  removeMora(@Param('id') id: string) {
    return this.pagoService.deleteMora(+id);
  }
}
