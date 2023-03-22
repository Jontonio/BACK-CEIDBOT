import { Injectable } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Apoderado } from 'src/apoderado/entities/apoderado.entity';
import { HandleMatricula } from 'src/class/global-handles';
import { Curso } from 'src/curso/entities/curso.entity';
import { DenominacionServicio } from 'src/denominacion-servicio/entities/denominacion-servicio.entity';
import { Estudiante } from 'src/estudiante/entities/estudiante.entity';
import { EstudianteService } from 'src/estudiante/estudiante.service';
import { Institucion } from 'src/institucion/entities/institucion.entity';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { Matricula } from './entities/matricula.entity';

@Injectable()
export class MatriculaService {

  constructor(@InjectRepository(Matricula) 
              private matModel:Repository<Matricula>,
              @InjectRepository(Apoderado) 
              private apoderadoModel:Repository<Apoderado>,
              private estudianteService:EstudianteService,
              @InjectRepository(Institucion) 
              private institucionModel:Repository<Institucion> ){}

  async create(createMatDto: CreateMatriculaDto) {

    try {
      //TODO: insertar apoderado si estudiante es menor de edad y verificar si existe apoderado
      if(createMatDto.estudiante.EsMayor){ 
        //TODO: Insertar estudiante
        createMatDto.estudiante.apoderado = null;
        const estudiante = await this.estudianteService.saveEstudiante(createMatDto.estudiante as Estudiante);
        //TODO: Insertar institucion
        const institucion = await this.institucionModel.save(createMatDto.institucion);
        // //TODO: guardar matricula
        createMatDto.estudiante = estudiante;
        createMatDto.institucion = institucion;
        const matricula = await this.matModel.save(createMatDto);

        return new HandleMatricula(`${estudiante.Nombres} se ha registrado su matricula correctamente`, true, matricula);
      }else{
         //TODO: Insertar si apoderado
        const apoderado = await this.apoderadoModel.save(createMatDto.estudiante.apoderado)
         //TODO: Insertar estudiante
         createMatDto.estudiante.apoderado = apoderado;
         const estudiante = await this.estudianteService.saveEstudiante(createMatDto.estudiante as Estudiante);
         const institucion = await this.institucionModel.save(createMatDto.institucion);
         // //TODO: guardar matricula
         createMatDto.estudiante = estudiante;
         createMatDto.institucion = institucion;
         const matricula = await this.matModel.save(createMatDto);
         return new HandleMatricula(`${estudiante.Nombres} se ha registrado su matricula correctamente`, true, matricula);
      }

    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_REGISTRAR_MATRICULAR');
    }
  
  }

  async findAll({limit, offset}:PaginationQueryDto) {
    try {
      const count = await this.matModel.countBy({ Estado:true });
      const data = await this.matModel.find({ 
                                              where:{ Estado:true }, 
                                              skip:offset, take:limit,
                                              order: { createdAt:'DESC' },
                                              relations:['estudiante','denomiServicio','curso','institucion'] });
      return new HandleMatricula('Lista registro de matriculas', true, data, count);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_GET_ESTUDIANTES_MATRICULADOS');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} matricula`;
  }

  update(id: number, updateMatriculaDto: UpdateMatriculaDto) {
    return `This action updates a #${id} matricula`;
  }

  remove(id: number) {
    return `This action removes a #${id} matricula`;
  }
}
