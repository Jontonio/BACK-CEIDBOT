import { Injectable, NotFoundException} from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { ApoderadoService } from 'src/apoderado/apoderado.service';
import { Apoderado } from 'src/apoderado/entities/apoderado.entity';
import { HandleMatricula } from 'src/class/global-handles';
import { Estudiante } from 'src/estudiante/entities/estudiante.entity';
import { EstudianteService } from 'src/estudiante/estudiante.service';
import { Institucion } from 'src/institucion/entities/institucion.entity';
import { InstitucionService } from 'src/institucion/institucion.service';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { Matricula } from './entities/matricula.entity';

@Injectable()
export class MatriculaService {

  constructor(@InjectRepository(Matricula) 
              private matModel:Repository<Matricula>,
              private apoderadoService:ApoderadoService,
              private estudianteService:EstudianteService,
              private institucioService:InstitucionService){}

  async create(createMatDto: CreateMatriculaDto) {

    try {
      //? TODO: insertar apoderado si estudiante es menor de edad y verificar si existe apoderado
      if(createMatDto.estudiante.EsMayor){ 
        //? TODO: Insertar estudiante
        createMatDto.estudiante.apoderado = null;
        const estudiante = await this.estudianteService.saveEstudiante(createMatDto.estudiante as Estudiante);
        //? TODO: Insertar institucion
        const institucion = await this.institucioService.saveInstitucion(createMatDto.institucion);
        //? TODO: guardar matricula
        createMatDto.estudiante = estudiante;
        createMatDto.institucion = institucion;
        const matricula = await this.matModel.save(createMatDto);
        return new HandleMatricula(`${estudiante.Nombres} se ha registrado su matricula correctamente`, true, matricula);
      }

      //? TODO: Insertar si apoderado
      //Verificar si existe apoderado
      let apoderado:Apoderado;
      const res = await this.apoderadoService.findOne(createMatDto.estudiante.apoderado.DNIApoderado);

      if(res.ok){ // si exite inicializo la variable con el que existe
        apoderado = res.data as Apoderado; 
      }else{ // inicializo la variable apoderado con el nuevo insertado
        const res = await this.apoderadoService.saveApoderado(createMatDto.estudiante.apoderado)
        apoderado = res;
      }

      //? TODO: Insertar estudiante
      createMatDto.estudiante.apoderado = apoderado;
      const estudiante = await this.estudianteService.saveEstudiante(createMatDto.estudiante as Estudiante);
      const institucion = await this.institucioService.saveInstitucion(createMatDto.institucion);
      //? TODO: guardar matricula
      createMatDto.estudiante = estudiante;
      createMatDto.institucion = institucion;
      const matricula = await this.matModel.save(createMatDto);
      return new HandleMatricula(`${estudiante.Nombres} se ha registrado su matricula correctamente`, true, matricula);

    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_REGISTRAR_PREMATRICULA');
    }
  
  }

  async findAll({limit, offset}:PaginationQueryDto) {
    try {
      const count = await this.matModel.countBy({ Estado:true });
      const data = await this.matModel.find({ 
        where:{ Estado:true }, 
        skip:offset, take:limit,
        order: { createdAt:'DESC' },
        relations:['estudiante', 'estudiante.apoderado','denomiServicio','curso','institucion'] });
      return new HandleMatricula('Lista registro de matriculas', true, data, count);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_GET_ESTUDIANTES_MATRICULADOS');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} matricula`;
  }

  async remove(Id: number) {
    try {

      //? TODO: verificar si existe persona
      const inscrito = await this.matModel.findOne({where:{ Id }, relations:['estudiante', 'estudiante.apoderado','institucion']})
      if(!inscrito){
        throw new NotFoundException(`La persona con Id ${Id} no existe, posiblemente ya haya sido eliminado`);
      }
      const { estudiante, institucion } = inscrito;
      //? TODO: Eliminar matricula
      await this.matModel.delete({Id});
      //? TODO: Eliminar institución
      await this.institucioService.remove(institucion.Id);
      //? TODO: Eliminar apoderado si existe
      if(estudiante.apoderado){
        const hermanos = await this.estudianteService.findAllHermanos(estudiante.apoderado.Id);
        if(hermanos.length==1){
          //? TODO: Eiminar estudiante
          await this.estudianteService.remove(estudiante.Id);
          const Id = estudiante.apoderado.Id;
          await this.apoderadoService.remove(Id);
        }else{
          //? TODO: Eiminar estudiante
          await this.estudianteService.remove(estudiante.Id);
        }
      }else{
        //? TODO: Eiminar estudiante sin padre
        await this.estudianteService.remove(estudiante.Id);
      }
      return new HandleMatricula(`Estudiante ${estudiante.Nombres} eliminado satisfactoriamente`, true, null);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_REMOVE_PERSONA');
    }
  }
}
