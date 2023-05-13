import { Controller, Get, Post, Body } from '@nestjs/common';
import { MedioDePagoService } from './medio-de-pago.service';
import { CreateMedioDePagoDto } from './dto/create-medio-de-pago.dto';

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

}
