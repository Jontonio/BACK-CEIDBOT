import { Controller, 
         Get, 
         Post, 
         Req, 
         Body, 
         Param, 
         Delete, 
         Query, 
         UseInterceptors, 
         UploadedFile, 
         Patch} from '@nestjs/common';
import { MatriculaService } from './matricula.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';

import { Request } from 'express';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';

@Controller('matricula')
export class MatriculaController {
  
  constructor(private readonly matriculaService: MatriculaService) {}

  @Post('prematricula-estudiante')
  create(@Body() createMatriculaDto: CreateMatriculaDto) {
    return this.matriculaService.registerPrematricula(createMatriculaDto);
  }

  @Get('get-prematriculas-estudiantes')
  findAll(@Query() pagination:PaginationQueryDto ) {
    return this.matriculaService.findAll(pagination);
  }

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file',{ dest:'./uploads' }))
  async handleFileMatricula(@UploadedFile() file:Express.Multer.File, @Req() req:Request){
    return this.matriculaService.uploadFileMatricula(file, req);
  }

  @Delete('eliminar-matriculado/:id')
  remove(@Param('id') id: string) {
    return this.matriculaService.remove(+id);
  }

  @Patch('update-matricula/:id')
  async updateMatricula(@Param('id') id:string, @Body() updateMatriculaDto:UpdateMatriculaDto){
    return this.matriculaService.update(+id, updateMatriculaDto);
  }
}
