import { Injectable, InternalServerErrorException} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleApoderado } from 'src/class/global-handles';
import { Repository } from 'typeorm';
import { CreateApoderadoDto } from './dto/create-apoderado.dto';
import { Apoderado } from './entities/apoderado.entity';

@Injectable()
export class ApoderadoService {
  
  constructor(@InjectRepository(Apoderado) 
              private apoderadoModel:Repository<Apoderado>){}

 /**
  * This function creates a new apoderado (guardian) and returns a success message with the created
  * apoderado object, or throws an error if there is an issue with the creation process.
  * @param {CreateApoderadoDto} createApoderadoDto - `createApoderadoDto` is a parameter of type
  * `CreateApoderadoDto`, which is an object containing the data needed to create a new "apoderado" (a
  * legal representative or guardian). This parameter is passed to the `create` method of a service
  * class, which then
  * @returns The `create` method is returning an instance of the `HandleApoderado` class with a success
  * message, a boolean value indicating success, and the newly created `apoderado` object. If an error
  * occurs during the creation process, an `InternalServerErrorException` is thrown.
  */
  async create(createApoderadoDto: CreateApoderadoDto) {
    try {
      const apoderado = await this.apoderadoModel.save(createApoderadoDto);
      return new HandleApoderado(`Apoderado ${apoderado.NomApoderado} registrado correctamente`, true, apoderado);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR CREATE APODERADO');
    }
  }

 /**
  * This is an asynchronous function that saves a new apoderado (guardian) using the provided data and
  * throws an error if there is an issue.
  * @param {CreateApoderadoDto} createApoderadoDto - `createApoderadoDto` is an object of type
  * `CreateApoderadoDto` which contains the data needed to create a new `Apoderado` entity. It is
  * likely that `CreateApoderadoDto` is a DTO (Data Transfer Object) class that defines the structure
  * of
  * @returns The `saveApoderado` method is returning the result of calling the `save` method on the
  * `apoderadoModel` with the `createApoderadoDto` as an argument. This is likely a Promise that
  * resolves to the saved apoderado object.
  */
  async saveApoderado(createApoderadoDto: CreateApoderadoDto) {
    try {
      return await this.apoderadoModel.save(createApoderadoDto);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR CREATE APODERADO SERVER');
    }
  }

  /**
   * This is an asynchronous function that finds an apoderado (a type of model) by their DNI (document
   * number) and returns a HandleApoderado object with information about the apoderado.
   * @param {string} DNI - DNI stands for "Documento Nacional de Identidad" which is a unique
   * identification number assigned to individuals in some countries, such as Spain and Peru. In this
   * code, it is used as a parameter to search for a specific apoderado (representative) in a database.
   * @returns The `findOne` method is returning an instance of the `HandleApoderado` class, which
   * contains information about the result of the query. The `get apoderado` string is a message
   * indicating the purpose of the query, the boolean value `apoderado?true:false` indicates whether a
   * result was found or not, and the `apoderado` variable contains the actual result of
   */
  async findOne(DNI: string) {
    try {
      const apoderado = await this.apoderadoModel.findOne({ where:{ Documento:DNI } });
      return new HandleApoderado('get apoderado', apoderado?true:false, apoderado);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR GET APODERADO');
    }
  }

  /**
   * This is an async function that removes an apoderado (proxy) from the database by its Id.
   * @param {number} Id - The parameter `Id` is a number that represents the unique identifier of an
   * apoderado (a person who has legal authority to act on behalf of another person, typically a
   * child). This function uses the `Id` parameter to find and remove the corresponding apoderado from
   * the database.
   * @returns the result of deleting an apoderado (represented by the Id parameter) from the database
   * using the apoderadoModel. If the apoderado is not found, a NotFoundException is thrown. If there
   * is an error during the deletion process, an InternalServerErrorException is thrown.
   */
  async remove(Id: number) {
    try {
      const apoderado = await this.apoderadoModel.findOne({where:{Id}});
      if(!apoderado){
        throw new NotFoundException(`No se encontro al apoderado con el Id ${Id}`);
      }
      return await this.apoderadoModel.update({Id},{ Estado:false });
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR REMOVE APODERADO');
    }
  }
}
