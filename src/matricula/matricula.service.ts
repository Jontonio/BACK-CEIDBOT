import { Injectable, NotFoundException, HttpStatus} from '@nestjs/common';
import { HttpException, InternalServerErrorException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { ApoderadoService } from 'src/apoderado/apoderado.service';
import { Apoderado } from 'src/apoderado/entities/apoderado.entity';
import { HandleMatricula } from 'src/class/global-handles';
import { Estudiante } from 'src/estudiante/entities/estudiante.entity';
import { EstudianteService } from 'src/estudiante/estudiante.service';
import { InstitucionService } from 'src/institucion/institucion.service';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { Matricula } from './entities/matricula.entity';
import { uploadFileDrive, uploadOthersFilesDrive } from 'src/helpers/googleDrive';
import * as fs from "fs-extra";
import { Request } from 'express';

@Injectable()
export class MatriculaService {

  constructor(@InjectRepository(Matricula) 
              private matModel:Repository<Matricula>,
              private apoderadoService:ApoderadoService,
              private estudianteService:EstudianteService,
              private institucioService:InstitucionService){}

  async create(createMatDto: CreateMatriculaDto) {

    try {
      //? TODO verificar si el estudiante existe registrado
      const data  = await this.estudianteService.findOneByDocumentoInternal(createMatDto.estudiante.Documento);

      //? TODO: insertar apoderado si estudiante es menor de edad y verificar si existe apoderado
      if(createMatDto.estudiante.EsMayor){ 
        //? TODO: Insertar estudiante
        createMatDto.estudiante.apoderado = null;
        if(data){
          const { data } = await this.estudianteService.updateByDocumento(createMatDto.estudiante.Documento, createMatDto.estudiante);
          const estudiante = data as  Estudiante;
          const institucion = await this.institucioService.saveInstitucion(createMatDto.institucion);
          //? TODO: guardar matricula
          createMatDto.estudiante = estudiante;
          createMatDto.institucion = institucion;
          return await this.matModel.save(createMatDto);
        }else{
          const estudiante = await this.estudianteService.saveEstudiante(createMatDto.estudiante as Estudiante);
          //? TODO: Insertar institucion
          const institucion = await this.institucioService.saveInstitucion(createMatDto.institucion);
          //? TODO: guardar matricula
          createMatDto.estudiante = estudiante;
          createMatDto.institucion = institucion;
          return await this.matModel.save(createMatDto);
        }
      }

      //? TODO: Insertar si apoderado
      //Verificar si existe apoderado
      let apoderado:Apoderado;
      const res = await this.apoderadoService.findOne(createMatDto.estudiante.apoderado.Documento);

      if(res.ok){ // si exite inicializo la variable con el que existe
        apoderado = res.data as Apoderado; 
      }else{ // inicializo la variable apoderado con el nuevo insertado
        const res = await this.apoderadoService.saveApoderado(createMatDto.estudiante.apoderado)
        apoderado = res;
      }

      if(data){
        const { data } = await this.estudianteService.updateByDocumento(createMatDto.estudiante.Documento, createMatDto.estudiante);
        const estudiante = data as  Estudiante;
        const institucion = await this.institucioService.saveInstitucion(createMatDto.institucion);
        //? TODO: guardar matricula
        createMatDto.estudiante = estudiante;
        createMatDto.institucion = institucion;
        return await this.matModel.save(createMatDto);
      }else{
        //? TODO: Insertar estudiante
        createMatDto.estudiante.apoderado = apoderado;
        const estudiante = await this.estudianteService.saveEstudiante(createMatDto.estudiante as Estudiante);

        const institucion = await this.institucioService.saveInstitucion(createMatDto.institucion);
        //? TODO: guardar matricula
        createMatDto.estudiante = estudiante;
        createMatDto.institucion = institucion;
        return await this.matModel.save(createMatDto);
      }

    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_REGISTRAR_PREMATRICULA');
    }
  
  }

  async registerPrematricula(createMatDto: CreateMatriculaDto) {

    try {
      //? TODO verificar si el estudiante existe registrado
      const data  = await this.estudianteService.findOneByDocumentoInternal(createMatDto.estudiante.Documento);

      //? TODO: insertar apoderado si estudiante es menor de edad y verificar si existe apoderado
      if(createMatDto.estudiante.EsMayor){ 
        //? TODO: Insertar estudiante
        createMatDto.estudiante.apoderado = null;
        if(data){
          const { data } = await this.estudianteService.updateByDocumento(createMatDto.estudiante.Documento, createMatDto.estudiante);
          const estudiante = data as  Estudiante;
          const institucion = await this.institucioService.saveInstitucion(createMatDto.institucion);
          //? TODO: guardar matricula
          createMatDto.estudiante = estudiante;
          createMatDto.institucion = institucion;
          const matricula = await this.matModel.save(createMatDto);
          return new HandleMatricula(`${estudiante.Nombres.toUpperCase()} se han registrado sus datos correctamente`, true, matricula);
        }else{
          const estudiante = await this.estudianteService.saveEstudiante(createMatDto.estudiante as Estudiante);
          //? TODO: Insertar institucion
          const institucion = await this.institucioService.saveInstitucion(createMatDto.institucion);
          //? TODO: guardar matricula
          createMatDto.estudiante = estudiante;
          createMatDto.institucion = institucion;
          const matricula = await this.matModel.save(createMatDto);
          return new HandleMatricula(`${estudiante.Nombres.toUpperCase()} se han registrado sus datos correctamente`, true, matricula);
        }
      }

      //? TODO: Insertar si apoderado
      //Verificar si existe apoderado
      let apoderado:Apoderado;
      const res = await this.apoderadoService.findOne(createMatDto.estudiante.apoderado.Documento);

      if(res.ok){ // si exite inicializo la variable con el que existe
        apoderado = res.data as Apoderado; 
      }else{ // inicializo la variable apoderado con el nuevo insertado
        const res = await this.apoderadoService.saveApoderado(createMatDto.estudiante.apoderado)
        apoderado = res;
      }

      if(data){
        const { data } = await this.estudianteService.updateByDocumento(createMatDto.estudiante.Documento, createMatDto.estudiante);
        const estudiante = data as  Estudiante;
        const institucion = await this.institucioService.saveInstitucion(createMatDto.institucion);
        //? TODO: guardar matricula
        createMatDto.estudiante = estudiante;
        createMatDto.institucion = institucion;
        const matricula = await this.matModel.save(createMatDto);
          return new HandleMatricula(`${estudiante.Nombres.toUpperCase()} se han registrado sus datos correctamente`, true, matricula);
      }else{
        //? TODO: Insertar estudiante
        createMatDto.estudiante.apoderado = apoderado;
        const estudiante = await this.estudianteService.saveEstudiante(createMatDto.estudiante as Estudiante);

        const institucion = await this.institucioService.saveInstitucion(createMatDto.institucion);
        //? TODO: guardar matricula
        createMatDto.estudiante = estudiante;
        createMatDto.institucion = institucion;
        const matricula = await this.matModel.save(createMatDto);
        return new HandleMatricula(`${estudiante.Nombres.toUpperCase()} se han registrado sus datos correctamente`, true, matricula);
      }

    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_REGISTRAR_PREMATRICULA');
    }
  
  }

  async findAll({limit, offset}:PaginationQueryDto) {
    try {
      const count = await this.matModel.countBy({ Estado:true, EstadoMatricula:'prematricula' });
      const data = await this.matModel.find({ 
        where:{ Estado:true, EstadoMatricula:'prematricula'}, 
        skip:offset, take:limit,
        order: { createdAt:'ASC' },
        relations:['estudiante', 'estudiante.apoderado','curso','curso.nivel','horario','denomiServicio','institucion'] });
      return new HandleMatricula('Lista registro de matriculas', true, data, count);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_GET_ESTUDIANTES_MATRICULADOS');
    }
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

  async uploadFileMatricula(file:Express.Multer.File, Req:Request){
    try {
      const allowedMimes = ['image/jpeg','image/jpg', 'image/png', 'application/pdf'];

      if (!allowedMimes.includes(file.mimetype)) {
        await fs.unlink(file.path)
        throw new HttpException(`Archivos permitidos (PDF - PNG - JPG)`, HttpStatus.BAD_REQUEST);
      }

      const in_mb = file.size / 1000000;

      if (in_mb > 4) {
        await fs.unlink(file.path)
        throw new HttpException(`Tamaño de archivo permitido mínimo 4 MB`, HttpStatus.BAD_REQUEST);
      }
      
      const { tipo, id_grupo } = Req.body;
      const { data } = (id_grupo)? await uploadFileDrive(file, id_grupo, tipo): await uploadOthersFilesDrive(file, tipo);
      await fs.unlink(file.path)
      return data;
    } catch (e) {
      const error = (e.code && e.code=='ETIMEDOUT')?'Revise su conexión a internet o la estabilidad del internet':'';
      throw new InternalServerErrorException(`Error al subir el archivo | ${(e.response?e.response:error)}`);
    }
  }

  async update(Id: number, matriculaDto:UpdateMatriculaDto){
    try {
      await this.matModel.update(Id, matriculaDto);
      return new HandleMatricula('Matricula actualizado correctamente', true, null);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_UPDATE_MATRICULA');
    }
  }
}
