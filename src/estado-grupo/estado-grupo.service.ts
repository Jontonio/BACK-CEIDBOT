import { Injectable, InternalServerErrorException, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateEstadoGrupoDto } from './dto/create-estado-grupo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoGrupo } from './entities/estado-grupo.entity';
import { Repository } from 'typeorm';
import { HandleEstadoGrupo } from 'src/class/global-handles';
import { UpdateEstadoGrupoDto } from './dto/update-estado-grupo.dto';

@Injectable()
export class EstadoGrupoService {

  constructor(@InjectRepository(EstadoGrupo) 
  private estadoGrupoModel:Repository<EstadoGrupo>){}

  /**
   * This function creates a new estadoGrupo (group state) and checks if it already exists before
   * saving it to the database.
   * @param {CreateEstadoGrupoDto} createEstadoGrupoDto - It is a parameter of type
   * CreateEstadoGrupoDto, which is likely an interface or a class defining the structure of the data
   * required to create a new EstadoGrupo (group state) object.
   * @returns an instance of the `HandleEstadoGrupo` class with a success message, a boolean value
   * indicating success, and the created `estadoGrupo` object as a parameter.
   */
  async create(createEstadoGrupoDto: CreateEstadoGrupoDto) {
    try {
      const existEstado = await this.estadoGrupoModel.findOneBy({ EstadoGrupo:createEstadoGrupoDto.EstadoGrupo, Estado:true });
      if(existEstado){
        throw new ConflictException(`El estado del grupo ya esta registado. Considere una nueva.`);
      }
      const estadoGrupo = await this.estadoGrupoModel.save(createEstadoGrupoDto);
      return new HandleEstadoGrupo(`Estado de grupo ${estadoGrupo.EstadoGrupo} creado correctamente`, true, estadoGrupo);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR CREATE ESTADO GRUPO');
    }
  }

  /**
   * This is an async function that updates the state of a group and returns a message indicating
   * whether the update was successful or not.
   * @param {number} Id - The ID of the estadoGrupo (group state) that needs to be updated.
   * @param {UpdateEstadoGrupoDto} updateEstadoGrupoDto - UpdateEstadoGrupoDto is a data transfer
   * object (DTO) that contains the updated information for an EstadoGrupo (group status) entity. It is
   * used to update the existing entity in the database.
   * @returns an instance of the `HandleEstadoGrupo` class with a message, a boolean value indicating
   * if the update was successful or not, and a null value for the data property.
   */
  async update(Id:number, updateEstadoGrupoDto: UpdateEstadoGrupoDto) {
    try {
      const existTipoMedioPago = await this.estadoGrupoModel.findOneBy({ Id });
      if(!existTipoMedioPago){
        throw new NotFoundException(`El estado de grupo con ${Id} no existe`);
      }
      const { affected } = await this.estadoGrupoModel.update({Id}, updateEstadoGrupoDto);
      if(affected==0) return new HandleEstadoGrupo(`Estado de grupo sin afectar`, false, null);
      return new HandleEstadoGrupo('Estado de grupo actualizado correctamente', true, null);

    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ACTUALIZAR ESTADO GRUPO')
    }
  }

  /**
   * This function deletes an existing estadoGrupo (group state) by setting its Estado property to
   * false.
   * @param {number} Id - The parameter `Id` is a number that represents the unique identifier of the
   * estado de grupo (group state) that needs to be deleted.
   * @returns an instance of the `HandleEstadoGrupo` class with a message indicating whether the
   * deletion was successful or not, a boolean value indicating the success status, and a null value
   * for the data property. If an error occurs during the deletion process, the function throws an
   * `InternalServerErrorException`.
   */
  async delete(Id:number) {
    try {
      const existTipoMedioPago = await this.estadoGrupoModel.findOneBy({ Id });
      if(!existTipoMedioPago){
        throw new NotFoundException(`El estado de grupo con ${Id} no existe`);
      }
      const { affected } = await this.estadoGrupoModel.update({Id}, { Estado: false });
      if(affected==0) return new HandleEstadoGrupo(`Estado de grupo sin afectar`, false, null);
      return new HandleEstadoGrupo('Estado de grupo eliminado correctamente', true, null);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ELIMINAR ESTADO GRUPO')
    }
  }

  /**
   * This function retrieves a list of registered group states and returns a HandleEstadoGrupo object
   * with a success message and the list of states, or an error message if the retrieval fails.
   * @returns The `findAll()` method is returning an instance of the `HandleEstadoGrupo` class with a
   * message, a boolean value indicating if the operation was successful, and an array of objects
   * representing the registered group states. If an error occurs during the execution of the method,
   * an `InternalServerErrorException` is thrown.
   */
  async findAll() {
    try {
      const listaEstadoGrupo = await this.estadoGrupoModel.find({ where:{ Estado: true } });
      if(listaEstadoGrupo.length==0){
        return new HandleEstadoGrupo(`Lista de estados de grupo vacía. Registre estados antes de crear nuevos grupos`, false, []);
      }
      return new HandleEstadoGrupo(`Lista de estados de grupo registrados`, true, listaEstadoGrupo);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER LISTA ESTADOS GRUPO');
    }
  }
}
