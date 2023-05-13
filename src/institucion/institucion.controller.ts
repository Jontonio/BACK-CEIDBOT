import { Controller, Post, Body } from '@nestjs/common';
import { InstitucionService } from './institucion.service';
import { CreateInstitucionDto } from './dto/create-institucion.dto';

@Controller('institucion')
export class InstitucionController {
  constructor(private readonly institucionService: InstitucionService) {}

  @Post('create-institucion')
  create(@Body() createInstitucionDto: CreateInstitucionDto) {
    return this.institucionService.create(createInstitucionDto);
  }
}
