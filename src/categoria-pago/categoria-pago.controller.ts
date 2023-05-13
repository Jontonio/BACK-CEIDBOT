import { Controller, Get } from '@nestjs/common';
import { CategoriaPagoService } from './categoria-pago.service';

@Controller('categoria-pago')
export class CategoriaPagoController {
  
  constructor(private readonly categoriaPagoService: CategoriaPagoService) {}

  @Get('get-all-categoria-pago')
  findAll() {
    return this.categoriaPagoService.findAll();
  }

}
