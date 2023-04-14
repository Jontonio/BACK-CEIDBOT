import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { NivelService } from './nivel.service';
import { CreateNivelDto } from './dto/create-nivel.dto';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';

@Controller('nivel')
export class NivelController {
  constructor(private readonly nivelService: NivelService) {}

  @Post('create-nivel')
  create(@Body() createNivelDto: CreateNivelDto) {
    return this.nivelService.create(createNivelDto);
  }

  @Get('get-all-niveles')
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.nivelService.findAll(pagination);
  }

}
