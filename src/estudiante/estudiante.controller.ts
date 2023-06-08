import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { EmailDocEstudianteDto } from './dto/emailDocestudiante.dto';
import { RequestEstudianteDto } from './dto/request-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@Controller('estudiante')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post('create-estudiante')
  create(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.estudianteService.create(createEstudianteDto);
  }

  @Post('verify-documento-email')
  verifyEmailDocumento(@Body() emailDocEstudianteDto: EmailDocEstudianteDto) {
    return this.estudianteService.verifyEmailDocumento(emailDocEstudianteDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estudianteService.findOne(+id);
  }

  @Post('get-estudiante-by-documento')
  findOneByDocumento(@Body() requestEstudianteDto:RequestEstudianteDto) {
    return this.estudianteService.findOneByDocumento(requestEstudianteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estudianteService.remove(+id);
  }

  @Patch('update-estudiante/:id')
  updateEstudiante(@Param('id') id:string, @Body() updateEstudianteDto:UpdateEstudianteDto){
    return this.estudianteService.update(+id, updateEstudianteDto);
  }

  @Patch('update-apoderado-estudiante/:id')
  updateAñoderadoEstudiante(@Param('id') id:string, @Body() updateEstudianteDto:UpdateEstudianteDto){
    return this.estudianteService.updateEstudianteApoderado(+id, updateEstudianteDto);
  }
}
