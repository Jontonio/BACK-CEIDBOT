import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Departamento } from './entities/departamento.entity';
import { Distrito } from './entities/distrito.entity';
import { Provincia } from './entities/provincia.entity';

@Injectable()
export class UbigeoService {

  constructor(@InjectRepository(Departamento) 
              private deparModel:Repository<Departamento>,
              @InjectRepository(Provincia) 
              private provinModel:Repository<Provincia>,
              @InjectRepository(Distrito) 
              private distModel:Repository<Distrito>){}

 /**
  * This is an asynchronous function that retrieves all departments from a database and throws an error
  * if there is an issue.
  * @returns The `findDepartamentos` function is returning a promise that resolves to the result of
  * calling the `find` method on the `deparModel`. This method is likely used to retrieve all documents
  * from a MongoDB collection that represents "departamentos". If an error occurs during the execution
  * of the function, an `InternalServerErrorException` is thrown with a custom error message.
  */
  async findDepartamentos(){
    try {
      return this.deparModel.find();
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR GET DEPARTAMENTOS');
    }
  }

  /**
   * This is an asynchronous function that finds provinces by a given parent ubigeo ID and returns the
   * result or throws an error.
   * @param {number} IdPadreUbigeo - IdPadreUbigeo is a number parameter that represents the ID of the
   * parent location in the Ubigeo system. In this case, the function is searching for provinces that
   * belong to a specific parent location identified by its IdPadreUbigeo.
   * @returns The `findProvincia` function is returning a promise that resolves to the result of
   * calling the `findBy` method on the `provinModel` object with the `IdPadreUbigeo` parameter.
   */
  async findProvincia(IdPadreUbigeo:number){
    try {
      return this.provinModel.findBy({ IdPadreUbigeo });
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR GET PROVINCIAS BY UBIGEO');
    }
  }

 /**
  * This is an asynchronous function that finds and returns a list of districts based on a given parent
  * location ID, sorted in ascending order by district name.
  * @param {number} IdPadreUbigeo - The parameter `IdPadreUbigeo` is a number that represents the
  * parent location code for a district. It is used to find all the districts that belong to a specific
  * location.
  * @returns a promise that resolves to an array of district objects that match the given
  * `IdPadreUbigeo` parameter, sorted in ascending order by their `NombreDistrito` property. If there
  * is an error, it throws an `InternalServerErrorException` with a custom error message.
  */
  async findDistrito(IdPadreUbigeo:number){
    try {
      return this.distModel.find({ where:{ IdPadreUbigeo }, order:{ NombreDistrito:'ASC'} });
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR GET DISTRITO BY UBIGEO');
    }
  }
  
}
