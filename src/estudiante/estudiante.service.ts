import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleEstudiante } from 'src/class/global-handles';
import { Repository } from 'typeorm';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { EmailDocEstudianteDto } from './dto/emailDocestudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { Estudiante } from './entities/estudiante.entity';
import { RequestEstudianteDto } from './dto/request-estudiante.dto';

@Injectable()
export class EstudianteService {

  constructor(@InjectRepository(Estudiante) 
              private estudianteModel:Repository<Estudiante>){}

  /**
   * This function creates a new student record and returns a success message with the student data or
   * throws an error if there is an issue.
   * @param {CreateEstudianteDto} createEstudianteDto - `createEstudianteDto` is a data transfer object
   * (DTO) that contains the information needed to create a new student record. It is likely an object
   * with properties such as `Nombres` (names), `Apellidos` (last names), `Edad` (age), `Correo`
   * @returns The `create` method is returning an instance of the `HandleEstudiante` class with a
   * success message, a boolean value indicating success, and the newly created `estudiante` object. If
   * an error occurs during the creation process, an `InternalServerErrorException` is thrown.
   */
  async create(createEstudianteDto: CreateEstudianteDto) {
    try {
      const estudiante = await this.estudianteModel.save(createEstudianteDto);
      return new HandleEstudiante(`Estudiante ${estudiante.Nombres} registrado correctamente`, true, estudiante);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR CREAR ESTUDIANTE');
    }
  }

  /**
   * This function verifies if an email and document number combination for a student is valid or not.
   * @param {EmailDocEstudianteDto} emailDocEstudianteDto - It is an object of type
   * EmailDocEstudianteDto which contains the email and document number of a student.
   * @returns an instance of the `HandleEstudiante` class with a message indicating whether the email
   * and document number provided in the `emailDocEstudianteDto` parameter are valid or not. If the
   * email is already registered with a different document number, the function returns a message
   * indicating that the email is already registered. If there are no issues with the email and
   * document number, the function returns a
   */
  async verifyEmailDocumento(emailDocEstudianteDto:EmailDocEstudianteDto){
    try {
      const estudiante = await this.estudianteModel.findOne({
        where:{ Email:emailDocEstudianteDto.Email }
      });

      if(estudiante){
        if(estudiante.Documento!=emailDocEstudianteDto.Documento){
          return new HandleEstudiante(`El email ${estudiante.Email} del estudiante ya se encuentra registrado`, false, null);
        }
      }
      return new HandleEstudiante(`El email del estudiante es válido`, true, null);

    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR VERIFICAR EMAIL DOCUMENTO ESTUDIANTE');
    }
  }

  /**
   * This is an asynchronous function that saves a new student record and throws an error if there is
   * an issue.
   * @param {CreateEstudianteDto} createEstudianteDto - `createEstudianteDto` is a data transfer object
   * (DTO) that contains the information needed to create a new student record in the database. It is
   * likely an object that has properties such as `nombre` (name), `apellido` (last name), `edad`
   * (age), `c
   * @returns The `saveEstudiante` method is returning the result of calling the `save` method on the
   * `estudianteModel` with the `createEstudianteDto` as an argument. The `save` method is likely a
   * method provided by the ORM or database library being used to persist the data. If the save
   * operation is successful, the method will return the saved entity.
   */
  async saveEstudiante(createEstudianteDto: CreateEstudianteDto) {
    try {
      return await this.estudianteModel.save(createEstudianteDto);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR CREAR ESTUDIANTE');
    }
  }

  /**
   * This function finds all students who have the same guardian based on the guardian's ID.
   * @param {number} IdApoderado - IdApoderado is a number that represents the ID of an apoderado
   * (guardian or parent) in a database. This function uses the ID to find all the estudiantes
   * (students) who have the same apoderado.
   * @returns This function is returning a Promise that resolves to an array of EstudianteModel objects
   * that have an Apoderado with the specified IdApoderado.
   */
  async findAllHermanos(IdApoderado:number) {
    try {
      return await this.estudianteModel.find({ where:{ apoderado:{ Id:IdApoderado } } });
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ENCONTRAR HERMANOS');
    }
  }

 /**
  * This is an asynchronous function that tries to find a student by their ID and returns the result,
  * but if there is an error, it logs the error message and throws an internal server error exception.
  * @param {number} Id - The parameter "Id" is a number that represents the unique identifier of an
  * "estudiante" (student) in a database. The function "findOne" is used to retrieve the information of
  * a single student based on their Id.
  * @returns The `findOne` method is returning a Promise that resolves to the result of calling the
  * `findOneBy` method on the `estudianteModel` object with the `Id` parameter as an argument. If the
  * operation is successful, the method will return the result of the query. If an error occurs, the
  * method will log the error message and throw an `InternalServerErrorException` with a custom error
  * message
  */
  async findOne(Id: number) {
    try {
      return await this.estudianteModel.findOneBy({Id});
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER ESTUDIANTE');
    }
  }

  /**
   * This function searches for a student by their document number and type, and returns a message
   * indicating whether the student was found or not, along with their information if they were found.
   * @param {RequestEstudianteDto} requestEstudianteDto - The parameter `requestEstudianteDto` is an
   * object of type `RequestEstudianteDto`, which contains the properties `Documento` and
   * `TipoDocumento`. These properties are used to query the database for a matching `Estudiante`
   * record. If a matching record is found, it is returned along with
   * @returns an instance of the `HandleEstudiante` class with a message, a boolean value indicating if
   * the student was found or not, and the student object itself if it was found. If the student was
   * not found, the function returns an instance of the `HandleEstudiante` class with a message
   * indicating that the student was not found, a boolean value of `false`, and a
   */
  async findOneByDocumento(requestEstudianteDto:RequestEstudianteDto) {
    try {
      const { Documento, TipoDocumento } = requestEstudianteDto;
      const query = TipoDocumento?{ Documento, TipoDocumento }:{ Documento };
      const estudiante = await this.estudianteModel.findOne({
        where: query,
        relations:['departamento','provincia','distrito','apoderado']
      });
      if(!estudiante){
        return new HandleEstudiante(`Estudiante con ${Documento} no encontrado`, false, null);
      }
      return new HandleEstudiante(`Se encontraron registros de ${estudiante.Nombres}, actualice los datos si fuese necesario para continuar`, true, estudiante);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER ESTUDIANTE');
    }
  }

 /**
  * This is an asynchronous function that finds a student by their document number and type of
  * document, if provided, and returns their information along with related data such as their
  * department, province, district, and guardian.
  * @param {string} Documento - The document number of the student being searched for.
  * @param [TipoDocumento] - TipoDocumento is an optional parameter that specifies the type of document
  * associated with the student. If it is provided, the function will search for a student with the
  * given Documento and TipoDocumento. If it is not provided, the function will only search for a
  * student with the given Documento.
  * @returns The `findOneByDocumentoInternal` function returns a Promise that resolves to an object
  * representing a student. The student object is obtained by querying the database using the
  * `estudianteModel` and searching for a record that matches the provided `Documento` and
  * `TipoDocumento` (if provided). The function also includes the related `departamento`, `provincia`,
  * `distrito`, and `apoderado
  */
  async findOneByDocumentoInternal(Documento: string, TipoDocumento = '') {
    try {
      const where = TipoDocumento?{ Documento, TipoDocumento }:{ Documento };
      return await this.estudianteModel.findOne({
        where,
        relations:['departamento','provincia','distrito','apoderado']
      });
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER ESTUDIANTE');
    }
  }

 /**
  * This function finds a student by their email address and returns their information along with
  * related data such as their department, province, district, and guardian.
  * @param {string} Email - The parameter `Email` is a string that represents the email address of an
  * individual. This function uses the email address to search for a student in the database and
  * returns the student's information along with their related entities such as department, province,
  * district, and apoderado (guardian).
  * @returns The `findOneByEmail` function is returning a Promise that resolves to an object
  * representing a single `Estudiante` (student) entity from the database that matches the provided
  * email address. The object includes related entities for the `departamento`, `provincia`,
  * `distrito`, and `apoderado` (guardian) of the student. If an error occurs during the database
  * query, an `
  */
  async findOneByEmail(Email: string) {
    try {
      return await this.estudianteModel.findOne({
        where:{ Email },
        relations:['departamento','provincia','distrito','apoderado']
      });
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTNER ESTUDIANTE');
    }
  }
  
  /**
   * This is an async function that updates a student's information by their document number and
   * returns a message indicating whether the update was successful or not.
   * @param {string} Documento - The document number of the student to be updated.
   * @param {UpdateEstudianteDto} updateEstudianteDto - UpdateEstudianteDto is a data transfer object
   * that contains the updated information for an Estudiante (student) entity. It is used to update the
   * properties of an existing Estudiante entity in the database.
   * @returns an instance of the `HandleEstudiante` class with a message, a boolean value indicating if
   * the operation was successful, and either the updated `estudiante` object or `null` depending on
   * the outcome of the update operation.
   */
  async updateByDocumento(Documento: string, updateEstudianteDto: UpdateEstudianteDto) {
    try {
      const { affected } = await this.estudianteModel.update({Documento}, updateEstudianteDto);
      if(affected==0) return new HandleEstudiante('Grupo sin afectar ', false, null)
      const estudiante = await this.estudianteModel.findOneBy({Documento});
      return new HandleEstudiante(`Estudiante ${estudiante.Nombres} actualizado correctamente`, true, estudiante);
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException('ERROR ACTUALIZAR ESTUDIANTE');
    }
  }

  /**
   * This is an asynchronous function that removes a student from a database by their ID and throws an
   * error if the student is not found or if there is an internal server error.
   * @param {number} Id - The parameter `Id` is a number that represents the unique identifier of an
   * `estudiante` (student) in the database. The `remove` function is an asynchronous method that uses
   * this `Id` to find and delete the corresponding `estudiante` from the database. If the `estudiante
   * @returns the result of deleting the student with the given Id from the database using the
   * `estudianteModel.delete()` method. If the student is not found, it throws a `NotFoundException`,
   * and if there is any other error, it throws an `InternalServerErrorException`.
   */
  async remove(Id: number) {
    try {
      const estudiante = await this.estudianteModel.findOne({where:{Id}});
      if(!estudiante){
        throw new NotFoundException(`No se encontro al estudiante con el Id ${Id}`);
      }
      return await this.estudianteModel.delete({Id});
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ELIMINAR ESTUDIANTE');
    }
  }

 /**
  * This is an async function that updates a student's information in a database and returns a message
  * indicating whether the update was successful or not.
  * @param {number} Id - The ID of the student to be updated.
  * @param {UpdateEstudianteDto} updateEstudianteDto - UpdateEstudianteDto is a data transfer object
  * (DTO) that contains the updated information for an Estudiante (student) entity. It is used as a
  * parameter in the update method to update the corresponding Estudiante entity in the database.
  * @returns an instance of the `HandleEstudiante` class with a message indicating whether the update
  * was successful or not, and a boolean value indicating the success status. If the update was not
  * successful, the `data` property of the `HandleEstudiante` instance will be `null`.
  */
  async update(Id:number, updateEstudianteDto:UpdateEstudianteDto){
    try {
      const existEstudiante = await this.estudianteModel.findOneBy({Id});
      if(!existEstudiante){
        throw new NotFoundException(`No se encontro al estudiante con el Id ${Id}`);
      }
      const { affected } = await this.estudianteModel.update(Id, updateEstudianteDto);
      if(affected==0) return new HandleEstudiante('Estudiante sin afectar ', false, null)
      return new HandleEstudiante(`Estudiante actualizado correctamente`, true, null);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ACTUALIZAR ESTUDIANTE');
    }
  }
}
