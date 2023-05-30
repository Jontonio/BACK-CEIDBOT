import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRolDto } from './dto/create-rol.dto';
import { Rol } from './entities/rol.entity';

@Injectable()
export class RolService {

  constructor(@InjectRepository(Rol) 
  private rolModel:Repository<Rol>){}

 /**
  * This is an asynchronous function that creates a new role and returns a success message with the
  * created data or throws an error if there is an issue.
  * @param {CreateRolDto} createRolDto - CreateRolDto is a data transfer object (DTO) that contains the
  * information needed to create a new role. It is likely defined elsewhere in the codebase and
  * contains properties such as the role name, description, and permissions.
  * @returns An object with the properties `data`, `ok`, and `msg`. The `data` property contains the
  * data of the newly created role, `ok` is a boolean value indicating whether the operation was
  * successful or not, and `msg` is a message indicating the result of the operation.
  */
  async create(createRolDto: CreateRolDto) {
    try {
      const data = await this.rolModel.save(createRolDto);
      return {data, ok:true, msg:'Nuevo rol registrado correctamente'};
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR REGISTRAR ROL')
    }
      
  }

  /**
   * This function retrieves a list of roles from a database and returns it along with a count and a
   * success message, or throws an error if there is a problem.
   * @returns An object with the properties `count`, `data`, `ok`, and `msg`. The `count` property
   * contains the number of roles found, the `data` property contains an array of role objects, the
   * `ok` property is a boolean indicating if the operation was successful, and the `msg` property
   * contains a message describing the result of the operation.
   */
  async findAll() {
    try {
      const count = await this.rolModel.count();
      const data = await this.rolModel.find();
      return { count, data, ok:true, msg:'Lista de roles'};
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER ROLES');
    }
  }

}
