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

  /**
   * This function creates a new registration for a student, including verifying if the student and
   * their guardian already exist and inserting them if necessary.
   * @param {CreateMatriculaDto} createMatDto - createMatDto is an object of type CreateMatriculaDto,
   * which contains the data needed to create a new matricula (enrollment) in the system. It includes
   * information about the student, the institution, and the apoderado (guardian) if applicable.
   * @returns the result of the `save` method called on the `matModel` object, which is likely a
   * Promise that resolves to the saved `createMatDto` object.
   */
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
      console.log(e.message)
      throw new InternalServerErrorException('ERROR REGISTRAR PREMATRICULA');
    }
  
  }

  /**
   * This function registers a prematricula (pre-enrollment) for a student, checking if the student and
   * their apoderado (legal guardian) exist and inserting them if necessary, and then saving the
   * matricula (enrollment) information.
   * @param {CreateMatriculaDto} createMatDto - The parameter `createMatDto` is an object of type
   * `CreateMatriculaDto`, which contains information about a student's pre-registration for a course.
   * It includes information about the student, the course, and the institution offering the course.
   * @returns an instance of the `HandleMatricula` class with a success message, a boolean value
   * indicating success or failure, and the saved `matricula` object.
   */
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
      console.log(e.message)
      throw new InternalServerErrorException('ERROR REGISTRAR PREMATRICULA SYSTEM');
    }
  
  }

 /**
  * This function finds all pre-registered students for a course and returns them with pagination and
  * related data.
  * @param {PaginationQueryDto}  - - `limit`: The maximum number of records to be returned in a single
  * query.
  * @returns The `findAll` method is returning an object of type `HandleMatricula` which contains a
  * message, a boolean value indicating if the operation was successful, an array of matriculation
  * data, and a count of the total number of matriculations that meet the specified criteria.
  */
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
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER ESTUDIANTES MATRICULADOS');
    }
  }

 /**
  * This function removes a student and their related data from the database, including their
  * enrollment, institution, and potentially their guardian.
  * @param {number} Id - The parameter `Id` is a number that represents the unique identifier of a
  * matricula (enrollment) that needs to be removed from the database.
  * @returns an instance of the `HandleMatricula` class with a message indicating that the student has
  * been successfully deleted, a boolean value of `true` to indicate success, and a `null` value for
  * the data property.
  */
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
      console.log(e.message)
      throw new InternalServerErrorException('ERROR EMILINAR PERSONA');
    }
  }

/**
 * This function uploads a file and checks if it meets certain requirements, such as file type and
 * size, before uploading it to Google Drive.
 * @param file - The file that is being uploaded using Multer middleware in an Express application. It
 * is of type Express.Multer.File.
 * @param {Request} Req - Req is an object of type Request, which is a part of the Express.js
 * framework. It contains information about the HTTP request that triggered the function, such as the
 * request headers, request body, request method, request URL, etc.
 * @returns the data object obtained from uploading the file to Google Drive after performing some
 * validations on the file. If any error occurs during the process, it throws an exception with an
 * error message.
 */
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
      console.log(e.message)
      throw new InternalServerErrorException(`ERROR AL SUBIR ARCHIVO | ${(e.response?e.response:error)}`);
    }
  }

 /**
  * This is an async function that updates a matricula record in a database and returns a success
  * message or throws an error if the record is not found or there is an internal server error.
  * @param {number} Id - The ID of the matricula (enrollment) that needs to be updated.
  * @param {UpdateMatriculaDto} matriculaDto - UpdateMatriculaDto is a data transfer object that
  * contains the updated information for a matricula (enrollment) entity. It is used to update the
  * existing matricula record in the database.
  * @returns an instance of the `HandleMatricula` class with a success message, a boolean value
  * indicating success, and a null error message.
  */
  async update(Id: number, matriculaDto:UpdateMatriculaDto){
    try {
      const existMatricula = await this.matModel.findOneBy({Id});
      if(!existMatricula){
        throw new NotFoundException(`La matricula con ID ${Id} no se encontro`)
      }
      await this.matModel.update(Id, matriculaDto);
      return new HandleMatricula('Matricula actualizado correctamente', true, null);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ACTUALIZAR MATRICULA');
    }
  }
}
