import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateTipoTramiteDto } from './dto/create-tipo-tramite.dto';
import { TipoTramite } from './entities/tipo-tramite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HandleTipoTramite } from 'src/class/global-handles';
import { UpdateTipoTramiteDto } from './dto/update-tipo-tramite.dto';

@Injectable()
export class TipoTramiteService {

  constructor(@InjectRepository(TipoTramite) 
  private tipoTramiteModel:Repository<TipoTramite>){}

 /**
  * This function creates a new TipoTramite document in the database and checks if it already exists
  * before saving it.
  * @param {CreateTipoTramiteDto} createTipoTramiteDto - It is a parameter of type
  * CreateTipoTramiteDto, which is likely an interface or a class defining the structure of the data
  * required to create a new "TipoTramite" (type of procedure).
  * @returns an instance of the `HandleTipoTramite` class with a success message, a boolean value
  * indicating success, and the created `tipoTramite` object. If there is an error, it throws an
  * `InternalServerErrorException` with a generic error message.
  */
  async create(createTipoTramiteDto: CreateTipoTramiteDto) {
    try {
      const existTipoTramite = await this.tipoTramiteModel.findOneBy({ TipoTramite:createTipoTramiteDto.TipoTramite });
      if(existTipoTramite){
        throw new ConflictException(`El tipo de trámite ya esta registado. Considere una nueva.`);
      }
      const tipoTramite = await this.tipoTramiteModel.save(createTipoTramiteDto);
      return new HandleTipoTramite('Tipo de trámite registrado correctamente', true, tipoTramite);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR REGISTRO TIPO TRAMITE');
    }
  }

  /**
   * This is an async function that updates a TipoTramite object in a database and returns a
   * HandleTipoTramite object with a success message or an error message.
   * @param {number} Id - The ID of the tipoTramite (type of procedure) that needs to be updated.
   * @param {UpdateTipoTramiteDto} updateTipoTramiteDto - UpdateTipoTramiteDto is a data transfer
   * object (DTO) that contains the updated information for a TipoTramite (a type of procedure or
   * paperwork). It is used to update an existing TipoTramite in the database.
   * @returns an instance of the `HandleTipoTramite` class with a message, a boolean value indicating
   * if the update was successful or not, and a null value for the data property.
   */
  async update(Id:number, updateTipoTramiteDto: UpdateTipoTramiteDto) {
    try {
      const existTipoModel = await this.tipoTramiteModel.findOneBy({ Id });
      if(!existTipoModel){
          throw new NotFoundException(`El denominación de servicio con ${Id} no existe`);
      }
      const { affected } = await this.tipoTramiteModel.update({ Id }, updateTipoTramiteDto);
      if(affected==0) return new HandleTipoTramite(`Tipo de trámite sin afectar`, false, null);
      return new HandleTipoTramite('Tipo de trámite actualizado correctamente', true, null);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ACTUALIZAR TIPO TRAMITE');
    }
  }

 /**
  * This function deletes a record from a database table based on the provided ID, and returns a
  * success message if the deletion was successful.
  * @param {number} Id - The parameter `Id` is a number that represents the unique identifier of a
  * TipoTramiteModel object that needs to be deleted from the database.
  * @returns an instance of the `HandleTipoTramite` class with a message indicating whether the
  * deletion was successful or not, and a boolean value indicating the success status. If the deletion
  * was not successful, the instance will also contain an error message.
  */
  async delete(Id:number) {
    try {
      const existTipoModel = await this.tipoTramiteModel.findOneBy({ Id });
        if(!existTipoModel){
            throw new NotFoundException(`El denominación de servicio con ${Id} no existe`);
        }
        const { affected } = await this.tipoTramiteModel.update({ Id },{ Estado: false });
        if(affected==0) return new HandleTipoTramite(`Tipo de trámite sin afectar`, false, null);
      return new HandleTipoTramite('Tipo de trámite eliminado correctamente correctamente', true, null);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ELIMINAR TIPO TRAMITE');
    }
  }

  /**
   * This function retrieves a list of active types of procedures and returns it with a count.
   * @returns The `findAll()` method is returning an instance of the `HandleTipoTramite` class with the
   * message "Lista de tipos de trámites registrados", a boolean value of `true`, an array of
   * `tiposTramites`, and the `count` of `tiposTramites` as parameters. If there is an error, it throws
   * an `InternalServerErrorException` with
   */
  async findAll() {
    try {
      const count = await this.tipoTramiteModel.count({ where:{Estado:true} });
      const tiposTramites = await this.tipoTramiteModel.find({ where:{ Estado:true } });
      return new HandleTipoTramite('Lista de tipos de trámites registrados', true, tiposTramites, count);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER LISTA DE TIPO DE TRAMITES');
    }
  }

}
