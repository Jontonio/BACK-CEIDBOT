import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import { Docente } from './entities/docente.entity';
import { HandleDocente } from 'src/class/global-handles';

@Injectable()
export class DocenteService {

  constructor(@InjectRepository(Docente) 
               private docenteModel:Repository<Docente>){}

  /**
   * This function creates a new docente and returns a success message with the docente object, or
   * throws an error if there is an issue.
   * @param {CreateDocenteDto} createDocenteDto - `createDocenteDto` is a parameter of type
   * `CreateDocenteDto` which is an object containing the data needed to create a new `Docente`
   * (teacher) in the system. This object is likely defined elsewhere in the codebase and contains
   * properties such as `Nombres` (
   * @returns The `create` function returns an instance of the `HandleDocente` class with a success
   * message, a boolean value indicating success, and the created `docente` object as its properties if
   * the creation of the `docente` object is successful. If there is an error during the creation
   * process, an `InternalServerErrorException` is thrown.
   */
  async create(createDocenteDto: CreateDocenteDto) {
    try {
      const docente = await this.docenteModel.save(createDocenteDto);
      return new HandleDocente(`Docente ${docente.Nombres} registrado correctamente`, true, docente);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR CREAR DOCENTE');
    }
  }

  /**
   * This function finds all active docentes with pagination and returns them along with a count.
   * @param {PaginationQueryDto}  - - `limit`: The maximum number of items to return in the result set.
   * @returns an object of type `HandleDocente` which contains a message, a boolean value indicating if
   * the operation was successful, an array of `docentes` (teachers) and a count of the total number of
   * teachers.
   */
  async findAll({limit, offset}:PaginationQueryDto) {
    try {
      const count = await this.docenteModel.countBy({Estado:true});
      const docentes = await this.docenteModel.find(
        { where:{ Estado:true }, 
          skip:offset, 
          take:limit, 
          order: { createdAt:'DESC' } 
        });
      return new HandleDocente('Lista de docentes', true, docentes, count);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER DOCENTES');
    }
  }

  /**
   * This is an asynchronous function that finds a document by its ID and returns a HandleDocente
   * object with a success message and the document data, or throws an error if it fails.
   * @param {number} Id - The parameter `Id` is a number that represents the unique identifier of a
   * docente (teacher) in a database. The `findOne` method is used to search for a docente with the
   * specified `Id` and a state of `true`. If a docente is found, the method returns
   * @returns an instance of the `HandleDocente` class with a message indicating that a docente with
   * the specified `Id` was found and a boolean value of `true` to indicate success, along with the
   * `docente` object that was retrieved from the database. If an error occurs during the database
   * query, an `InternalServerErrorException` is thrown.
   */
  async findOne(Id: number) {
    try {
      const docente = await this.docenteModel.findOneBy({ Id, Estado:true });
      return new HandleDocente(`Docente con ${docente.Id} encontrado`, true, docente);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER DOCENTE');
    }
  }

  /**
   * This is an async function that updates a Docente (teacher) record in a database and returns a
   * message indicating whether the update was successful or not.
   * @param {number} Id - The ID of the docente (teacher) to be updated.
   * @param {UpdateDocenteDto} updateDocenteDto - UpdateDocenteDto is a data transfer object that
   * contains the updated information for a Docente (teacher) entity. It is used as a parameter for the
   * update method to update the corresponding Docente entity in the database.
   * @returns an instance of the `HandleDocente` class with a message, a boolean value indicating if
   * the update was successful or not, and a null value for the data property. If an error occurs
   * during the update process, the function throws an `InternalServerErrorException`.
   */
  async update(Id: number, updateDocenteDto: UpdateDocenteDto) {
    try {
      const { affected } = await this.docenteModel.update(Id, updateDocenteDto);
      if(affected==0) return new HandleDocente(`Docente sin afectar`, false, null);
      const usuario = await this.docenteModel.findOneBy({Id});
      return new HandleDocente(`Docente ${usuario.Nombres} actualizado correctamente`, true, null);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ACTUALIZAR DOCENTE');
    }
  }

  /**
   * This is an async function that removes a docente (teacher) by updating their Estado (status) to
   * false and returns a message indicating whether the removal was successful or not.
   * @param {number} Id - The parameter `Id` is a number that represents the unique identifier of a
   * `Docente` (teacher) in the database. This method is used to remove a `Docente` from the database
   * by setting its `Estado` (status) to false.
   * @returns The `remove` function returns an instance of the `HandleDocente` class with a message, a
   * boolean indicating if the operation was successful, and either the deleted `usuario` object or
   * `null`.
   */
  async remove(Id: number) {
    try {
      const { affected } = await this.docenteModel.update(Id,{ Estado:false });
      if(affected==0) return new HandleDocente(`Docente sin afectar`, false, null);
      const usuario = await this.docenteModel.findOneBy({Id});
      return new HandleDocente(`Docente ${usuario.Nombres} eliminado correctamente`, true, usuario);
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException('ERROR ELIMINAR DOCENTE');
    }
  }

 /**
  * This function retrieves a docente (teacher) from a database based on their email address.
  * @param {string} Email - Email is a string parameter that represents the email address of a docente
  * (teacher).
  * @returns The function `getDocenteWithEmail` returns a Promise that resolves to a single
  * `docenteModel` object that matches the provided `Email` parameter. If no matching object is found,
  * it returns `null`. If an error occurs during the database query, it throws an
  * `InternalServerErrorException` with a custom error message.
  */
  async getDocenteWithEmail(Email:string){
    try {
      return await this.docenteModel.findOne({
        where:{ Email }
      })
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER DOCENTE POR EMAIL');
    }
  }

 /**
  * This function retrieves a docente (teacher) from a database based on their document number.
  * @param {string} Documento - Documento is a string parameter that represents the document number of
  * a docente (teacher) in a database. The function `getDocenteWithDocument` uses this parameter to
  * search for a docente in the database and returns the docente object if found.
  * @returns The `getDocenteWithDocument` function is returning a Promise that resolves to a single
  * document from the `docenteModel` that matches the provided `Documento` parameter. If there is an
  * error, it will throw an `InternalServerErrorException` with a custom error message.
  */
  async getDocenteWithDocument(Documento:string){
    try {
      return await this.docenteModel.findOne({ where:{ Documento } })
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER DOCENTE POR DOCUMENTO');
    }
  }

  /**
   * This is an asynchronous function that retrieves a single document from a database based on a given
   * ID.
   * @param {number} Id - The parameter `Id` is a number representing the unique identifier of a
   * `docente` (teacher) in a database. The `getOneById` function is an asynchronous function that
   * retrieves a single `docente` record from the database based on the provided `Id`.
   * @returns a Promise that resolves to the result of a query to find a single document in the
   * "docenteModel" collection that matches the given "Id" parameter. If the query is successful, the
   * function returns the document. If an error occurs during the query, the function throws an
   * InternalServerErrorException with a custom error message.
   */
  async getOneById(Id:number){
    try {
      return await this.docenteModel.findOne({
        where:{ Id }
      })
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER DOCENTE POR ID');
    }
  }

}
