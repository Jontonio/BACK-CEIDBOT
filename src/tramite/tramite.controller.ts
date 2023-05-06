import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TramiteService } from './tramite.service';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';

@Controller('tramite')
export class TramiteController {
  constructor(private readonly tramiteService: TramiteService) {}

  @Post()
  create(@Body() createTramiteDto: CreateTramiteDto) {
    return this.tramiteService.create(createTramiteDto);
  }

  @Get()
  findAll() {
    return this.tramiteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tramiteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTramiteDto: UpdateTramiteDto) {
    return this.tramiteService.update(+id, updateTramiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tramiteService.remove(+id);
  }
}
