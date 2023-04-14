import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MensualidadService } from './mensualidad.service';
import { CreateMensualidadDto } from './dto/create-mensualidad.dto';
import { UpdateMensualidadDto } from './dto/update-mensualidad.dto';
import { FirstMensualidadDto } from './dto/first-mensualidad.dto';

@Controller('mensualidad')
export class MensualidadController {
  constructor(private readonly mensualidadService: MensualidadService) {}

  @Post()
  create(@Body() createMensualidadDto: CreateMensualidadDto) {
    return this.mensualidadService.create(createMensualidadDto);
  }

  @Post('first-mensualidad')
  firstCreate(@Body() firstMensualidadDto: FirstMensualidadDto) {
    return this.mensualidadService.firstCreate(firstMensualidadDto);
  }

  @Get()
  findAll() {
    return this.mensualidadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mensualidadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMensualidadDto: UpdateMensualidadDto) {
    return this.mensualidadService.update(+id, updateMensualidadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mensualidadService.remove(+id);
  }
}
