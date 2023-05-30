import { Injectable, InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleHorario } from 'src/class/global-handles';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { Horario } from './entities/horario.entity';

@Injectable()
export class HorarioService {

  constructor(@InjectRepository(Horario) 
               private horarioModel:Repository<Horario>){}

 /**
  * This function creates a new horario and returns a success message with the created horario object
  * or throws an error if there is an issue.
  * @param {CreateHorarioDto} createHorarioDto - `createHorarioDto` is a data transfer object (DTO)
  * that contains the information needed to create a new `Horario` object. It is likely defined as an
  * interface or class with properties such as `dia`, `horaInicio`, `horaFin`, etc. The `create()`
  * method
  * @returns A new instance of the `HandleHorario` class with a success message, a boolean value
  * indicating success, and the newly created `horario` object.
  */
  async create(createHorarioDto: CreateHorarioDto) {
    try {
      const horario = await this.horarioModel.save(createHorarioDto)
      return new HandleHorario(`Nuevo horario registrado correctamente`, true, horario);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR REGISTRAR HORARIO');
    }
  }

 /**
  * This function retrieves a list of registered schedules with pagination and returns it along with a
  * count of the total number of schedules.
  * @param {PaginationQueryDto}  - - `limit`: The maximum number of items to return in the result set.
  * @returns A HandleHorario object containing a message, a boolean indicating success or failure, an
  * array of horario data, and a count of the total number of horarios that meet the criteria.
  */
  async findAll({ limit, offset }: PaginationQueryDto) {
    try {
      const count = await this.horarioModel.countBy({ Estado:true });
      const data = await this.horarioModel.find({
        where:{ Estado:true },
        skip:offset, take:limit 
      });
      return new HandleHorario('Lista de horarios registrados', true, data, count);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER HORARIOS SYSTEM');
    }
  }

  /**
   * This function finds and returns a list of registered schedules with their count.
   * @returns The `findListHorarios()` function is returning an object of type `HandleHorario` which
   * contains a message, a boolean value indicating success or failure, an array of data representing a
   * list of registered schedules, and a count of the number of registered schedules. If an error
   * occurs, an `InternalServerErrorException` is thrown.
   */
  async findListHorarios() {
    try {
      const count = await this.horarioModel.countBy({ Estado:true });
      const data = await this.horarioModel.find({
        where:{ Estado:true } 
      });
      return new HandleHorario('Lista de horarios registrados', true, data, count);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER LISTA HORARIOS');
    }
  }

}
