import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TramiteService } from './tramite.service';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';

@Controller('tramite')
export class TramiteController {
  constructor(private readonly tramiteService: TramiteService) {}

  @Post('register-new-tramite')
  create(@Body() createTramiteDto: CreateTramiteDto) {
    return this.tramiteService.create(createTramiteDto);
  }

  @Get('get-all-tramites')
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.tramiteService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tramiteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTramiteDto: UpdateTramiteDto) {
    return this.tramiteService.update(+id, updateTramiteDto);
  }

  @Delete('delete-tramite/:id')
  remove(@Param('id') id: string) {
    return this.tramiteService.remove(+id);
  }
}
