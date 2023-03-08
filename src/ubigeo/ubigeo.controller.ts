import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UbigeoService } from './ubigeo.service';
import { CreateProvinviaDto } from './dto/create-distrito.dto';
import { UpdateUbigeoDto } from './dto/update-distrito.dto';

@Controller('ubigeo')
export class UbigeoController {
  constructor(private readonly ubigeoService: UbigeoService) {}

  @Post()
  create(@Body() createUbigeoDto: CreateProvinviaDto) {
    return this.ubigeoService.create(createUbigeoDto);
  }

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
