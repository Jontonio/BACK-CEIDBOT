import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LibroService } from './libro.service';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';

@Controller('libro')
export class LibroController {
  constructor(private readonly libroService: LibroService) {}

  @Post('register-libro')
  create(@Body() createLibroDto: CreateLibroDto) {
    return this.libroService.create(createLibroDto);
  }

  @Get('get-one-libro/:id')
  findOne(@Param('id') id: string) {
    return this.libroService.findOne(+id);
  }

  @Patch('update-libro/:id')
  update(@Param('id') id: string, @Body() updateLibroDto: UpdateLibroDto) {
    return this.libroService.update(+id, updateLibroDto);
  }

  @Delete('delete-libro/:id')
  remove(@Param('id') id: string) {
    return this.libroService.remove(+id);
  }
}
