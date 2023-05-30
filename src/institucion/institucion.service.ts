import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleInstitucion } from 'src/class/global-handles';
import { Repository } from 'typeorm';
import { CreateInstitucionDto } from './dto/create-institucion.dto';
import { Institucion } from './entities/institucion.entity';

@Injectable()
export class InstitucionService {
  constructor(@InjectRepository(Institucion) 
              private instituModel:Repository<Institucion>){}

  /**
   * This function creates a new institution and returns a success message with the institution details
   * or throws an error if there is an issue.
   * @param {CreateInstitucionDto} createInstitucionDto - `createInstitucionDto` is a parameter of type
   * `CreateInstitucionDto`. It is likely an object that contains data needed to create a new
   * institution, such as the name of the institution, its address, and other relevant information.
   * This parameter is used in the `save` method
   * @returns The `create` method is returning an instance of the `HandleInstitucion` class with a
   * success message, a boolean value indicating success, and the newly created `institucion` object.
   * If an error occurs during the save operation, an `InternalServerErrorException` is thrown.
   */
  async create(createInstitucionDto: CreateInstitucionDto) {
    try {
      const institucion = await this.instituModel.save(createInstitucionDto);
      return new HandleInstitucion(`Institución ${institucion.NombreInstitucion} registrado correctamente`, true, institucion);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR REGISTRAR INSTITUCION');
    }
  }

  /**
   * This is an asynchronous function that saves an institution using a DTO and catches any errors,
   * throwing an exception if necessary.
   * @param {CreateInstitucionDto} createInstitucionDto - CreateInstitucionDto is a data transfer
   * object (DTO) that contains the information needed to create a new institution. It likely includes
   * properties such as the institution's name, address, contact information, and any other relevant
   * details. This parameter is passed to the `saveInstitucion` method to
   * @returns The `saveInstitucion` method is returning the result of the `save` method of the
   * `instituModel` object, which is likely a Promise that resolves to the saved institution data.
   */
  async saveInstitucion(createInstitucionDto: CreateInstitucionDto) {
    try {
      return await this.instituModel.save(createInstitucionDto);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR REGISTRAR INSTITUCION SYSTEM');
    }
  }

  /**
   * This is an async function that removes an institution from the database by its ID and throws an
   * error if it doesn't exist or if there's an internal server error.
   * @param {number} Id - The parameter `Id` is a number that represents the unique identifier of an
   * institution that needs to be removed from the database.
   * @returns The `remove` method is returning the result of deleting the institution with the
   * specified `Id` from the database. If the institution is not found, a `NotFoundException` is
   * thrown. If there is an error during the deletion process, an `InternalServerErrorException` is
   * thrown.
   */
  async remove(Id: number) {
    try {
      const institucion = await this.instituModel.findOne({where:{Id}});
      if(!institucion){
        throw new NotFoundException(`No se encontro a la institución con el Id ${Id}`);
      }
      return await this.instituModel.delete({Id});
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ELIMINAR INSTITUCION');
    }
  }

}
