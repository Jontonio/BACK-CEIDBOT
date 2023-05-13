import { Controller, Get, Param } from '@nestjs/common';
import { UbigeoService } from './ubigeo.service';

@Controller('ubigeo')
export class UbigeoController {
  constructor(private readonly ubigeoService: UbigeoService) {}

  @Get('departamento')
  findAllDepartamento() {
    return this.ubigeoService.findDepartamentos();
  }

  @Get('provincia/:id')
  findProvincia(@Param('id') id: string) {
    return this.ubigeoService.findProvincia(+id);
  }

  @Get('distrito/:id')
  findDistrito(@Param('id') id: string) {
    return this.ubigeoService.findDistrito(+id);
  }

}
