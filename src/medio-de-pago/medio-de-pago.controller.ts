import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedioDePagoService } from './medio-de-pago.service';
import { CreateMedioDePagoDto } from './dto/create-medio-de-pago.dto';
import { UpdateMedioDePagoDto } from './dto/update-medio-de-pago.dto';

@Controller('medio-de-pago')
export class MedioDePagoController {
  constructor(private readonly medioDePagoService: MedioDePagoService) {}

  @Post('register-medio-pago')
  create(@Body() createMedioDePagoDto: CreateMedioDePagoDto) {
    return this.medioDePagoService.create(createMedioDePagoDto);
  }

  @Get('get-all-medios-pago')
  findAll() {
    return this.medioDePagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medioDePagoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedioDePagoDto: UpdateMedioDePagoDto) {
    return this.medioDePagoService.update(+id, updateMedioDePagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medioDePagoService.remove(+id);
  }
}
