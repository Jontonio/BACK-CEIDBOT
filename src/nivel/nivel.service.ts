import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateNivelDto } from './dto/create-nivel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Nivel } from './entities/nivel.entity';
import { Repository } from 'typeorm';
import { HandleNivel } from 'src/class/global-handles';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';

@Injectable()
export class NivelService {
  
  constructor(@InjectRepository(Nivel) 
               private nivelModel:Repository<Nivel>){}

  /**
   * This function creates a new level and returns a success message with the created level or throws
   * an error if there is an issue.
   * @param {CreateNivelDto} createNivelDto - `createNivelDto` is a data transfer object (DTO) that
   * contains the information needed to create a new "nivel" (level) in the system. It is likely an
   * object with properties such as `name`, `description`, `minimumScore`, etc. The `async create`
   * function
   * @returns A `HandleNivel` object with a success message, a boolean value indicating success, and
   * the newly created `nivel` object.
   */
  async create(createNivelDto: CreateNivelDto) {
    try {
      const nivel = await this.nivelModel.save(createNivelDto)
      return new HandleNivel(`Nuevo nivel registrado correctamente`, true, nivel);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR REGISTRA NIVEL');
    }
  }

 /**
  * This function finds and returns a list of registered levels with pagination and error handling.
  * @param {PaginationQueryDto}  - The function `findAll` takes in an object with two properties:
  * `offset` and `limit`. These properties are of type `PaginationQueryDto`. The `offset` property is
  * used to specify the starting point of the data to be retrieved, while the `limit` property is used
  * to specify the
  * @returns A HandleNivel object with a message, a boolean indicating success, an array of data
  * (niveles), and a count of the total number of niveles that meet the criteria.
  */
  async findAll({offset, limit}: PaginationQueryDto) {
    try {
      const count = await this.nivelModel.countBy( { Estado:true } );
      const data = await this.nivelModel.find({
        where:{ Estado:true }, 
        skip:offset, take:limit 
      });
      return new HandleNivel('Lista de niveles registrados', true, data, count);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTNER NIVELES');
    }
  }

}
