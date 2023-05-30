import { Injectable, InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleCurso, HandleModulo } from 'src/class/global-handles';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso } from './entities/curso.entity';
import { Modulo } from './entities/modulo.entity';
import { CreateModuloDto } from './dto/create-modulo.dto';

@Injectable()
export class CursoService {

  constructor(@InjectRepository(Curso) 
              private cursoModel:Repository<Curso>,
              @InjectRepository(Modulo) 
              private moduloModel:Repository<Modulo>){}

  /**
   * This function creates a new course and returns a message indicating whether it was successfully
   * registered or not.
   * @param {CreateCursoDto} createCursoDto - CreateCursoDto is a data transfer object (DTO) that
   * contains the information needed to create a new curso (course). It likely includes properties such
   * as the name of the course, the level of the course, the duration, the description, and any other
   * relevant information. This parameter is used to create
   * @returns The `createCurso` function is returning an instance of the `HandleCurso` class with a
   * success message, a boolean value indicating success, and the `curso` object that was saved to the
   * database.
   */
  async createCurso(createCursoDto: CreateCursoDto) {
    try {
      const curso = await this.cursoModel.save(createCursoDto);
      return new HandleCurso(`Curso ${curso.NombreCurso } de nivel ${curso.nivel.Nivel } registrado correctamente`, true, curso);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR CREAR NUEVO CURSO');
    }
  }
  
 /**
  * This function creates a new module and returns a message indicating whether the creation was
  * successful or not.
  * @param {CreateModuloDto} createModuloDto - CreateModuloDto is a data transfer object that contains
  * the information needed to create a new module. It is likely defined elsewhere in the codebase and
  * includes properties such as the name of the module, its description, and any other relevant
  * details.
  * @returns The `createModulo` function returns an instance of the `HandleModulo` class with a
  * message, a boolean value indicating success or failure, and either the newly created `resModulo`
  * object or `null` if the module already exists.
  */
  async createModulo(createModuloDto: CreateModuloDto) {
    try {
      const modulo = await this.moduloModel.findOneBy({ Modulo: createModuloDto.Modulo });
      if(modulo){
        return new HandleModulo(`El módulo ${createModuloDto.Modulo } ya se encuentra registrado`, false, null);
      }
      const resModulo = await this.moduloModel.save(createModuloDto);
      return new HandleModulo(`Módulo ${resModulo.Modulo } registrado correctamente`, true, resModulo);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR CREAR NUEVO MODULO');
    }
  }

  /**
   * This function finds all courses with a true state, applies pagination, sorting, and includes
   * related entities, and returns a HandleCurso object with the courses and their count.
   * @param {PaginationQueryDto}  - - `limit`: The maximum number of items to return in the result set.
   * @returns an instance of the `HandleCurso` class with the message "Lista de cursos", a boolean
   * value of `true`, an array of `cursos` (courses) that match the query parameters, and the `count`
   * of all courses that match the query parameters.
   */
  async findAllCursos({limit, offset}:PaginationQueryDto) {
    try {
      const count = await this.cursoModel.countBy({ Estado:true });
      const cursos = await this.cursoModel.find({ 
        where: { Estado:true }, 
        skip:offset, 
        take:limit, 
        order: { createdAt:'DESC' },
        relations:['nivel','libros','modulo'] 
      });
      return new HandleCurso(`Lista de cursos`, true, cursos, count);
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException('ERROR OBTENER CURSOS');
    }
  }

  async findAllModulos({limit, offset}:PaginationQueryDto) {
    try {
      const count = await this.moduloModel.count();
      const modulos = await this.moduloModel.find({ 
        skip:offset, 
        take:limit, 
        order: { Modulo:'ASC' }
      });
      return new HandleModulo(`Lista de modulos`, true, modulos, count);
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException('ERROR OBTENER MODULOS');
    }
  }

 /**
  * This function retrieves a list of courses that are open for enrollment and returns them along with
  * a count of the total number of courses.
  * @returns The method `cursosInscripcion()` is returning an instance of the `HandleCurso` class with
  * the following properties:
  */
  async cursosInscripcion() {
    try {
      const count = await this.cursoModel.countBy({ Estado:true, EstadoApertura:true });
      const cursos = await this.cursoModel.find(
        { where: { Estado:true, EstadoApertura:true }, 
        order: { createdAt:'DESC' },
        relations:['nivel','libros'] 
      });
      return new HandleCurso(`Lista de cursos`, true, cursos, count);
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException('ERROR OBTENER CURSOS INSCRIPCION');
    }
  }
/**
 * This function finds a course by its ID and returns a HandleCurso object with the course's name, a
 * boolean value indicating success, and the course object itself.
 * @param {number} Id - The parameter `Id` is a number that represents the unique identifier of a
 * course. It is used to query the database and retrieve the course with the matching `Id`.
 * @returns The `findOne` method is returning an instance of the `HandleCurso` class with the course
 * name, a boolean value indicating success, and the course object retrieved from the database.
 */

  async findOne(Id: number) {
    try {
      const curso = await this.cursoModel.findOne({
        where:{ Id },
        relations:['nivel','libros','modulo']
      });
      return new HandleCurso(`Curso ${curso.NombreCurso}`, true, curso);
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException('ERROR OBTENER EL CURSO');
    }
  }

  /**
   * This is an asynchronous function that searches for a course by name and level (if provided) and
   * returns the results with related data.
   * @param {string} NombreCurso - A string representing the name of the course to search for.
   * @param [Nivel] - Nivel is an optional parameter with a default value of an empty string. It is
   * used to filter the search results by the level of the course. If a value is provided for Nivel,
   * the search will only return courses with a matching level. If no value is provided, the search
   * will return
   * @returns a Promise that resolves to an array of Curso objects that match the given NombreCurso and
   * Nivel (if provided) and have EstadoApertura set to true. The function also includes the related
   * Nivel and Modulo objects for each Curso in the returned array. If an error occurs, the function
   * throws an InternalServerErrorException.
   */
  async findByName(NombreCurso: string, Nivel = '') {
    try {
      const query1:FindOptionsWhere<Curso> = { EstadoApertura:true, NombreCurso, nivel:{ Nivel } };
      const query2:FindOptionsWhere<Curso> = { EstadoApertura:true, NombreCurso };

      return await this.cursoModel.find({
        where: Nivel?query1:query2,
        relations:['nivel','modulo']
      });
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException('ERROR OBTENER CURSO POR NOMBRE');
    }
  }

  /**
   * This is an async function that updates a course in a database and returns a message indicating
   * whether the update was successful or not.
   * @param {number} Id - The Id parameter is a number that represents the unique identifier of a
   * course.
   * @param {UpdateCursoDto} updateCursoDto - UpdateCursoDto is likely a data transfer object (DTO)
   * that contains the updated information for a course. It could include properties such as the course
   * name, description, start date, end date, etc. The function is using this DTO to update the course
   * with the specified Id in the database.
   * @returns The `update` method is returning an instance of the `HandleCurso` class with a message
   * indicating whether the curso was updated successfully or not, and a boolean value indicating the
   * success status. If the curso was not updated, the `affected` property will be 0 and the message
   * will indicate that the curso was not affected. If an error occurs during the update process, an
   * `InternalServerErrorException`
   */
  async update(Id: number, updateCursoDto: UpdateCursoDto) {
    try {
      const { affected } = await this.cursoModel.update(Id, updateCursoDto);
      if(affected==0) return new HandleCurso(`curso sin afectar`, false, null);
      const { NombreCurso } = await this.cursoModel.findOneBy({Id});
      return new HandleCurso(`Curso ${NombreCurso.toUpperCase()} actualizado correctamente`, true, null);
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException('ERROR ACTUAIZAR CURSO');
    }
  }

  /**
   * This is an asynchronous function that removes a course by updating its state to false and returns
   * a message indicating whether the course was successfully deleted or not.
   * @param {number} Id - The parameter `Id` is a number representing the identifier of a course that
   * needs to be removed.
   * @returns The `remove` function is returning an instance of the `HandleCurso` class with a message
   * indicating whether the course was successfully deleted or not, and a boolean value indicating the
   * success status. If the course was successfully deleted, the `HandleCurso` instance will have a
   * `null` value for its third parameter. If the course was not affected (i.e. it did not exist in the
   * database
   */
  async remove(Id: number) {
    try {
      const { affected } = await this.cursoModel.update(Id,{ Estado:false });
      if(affected==0) return new HandleCurso(`Curso sin afectar`, false, null);
      const { NombreCurso } = await this.cursoModel.findOneBy({Id});
      return new HandleCurso(`Curso ${NombreCurso.toUpperCase()} eliminado correctamente`, true, null);
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException('ERROR ELIMNAR CURSO');
    }
  }

  /**
   * This is an asynchronous function that retrieves a course by its ID from a database using the
   * Sequelize ORM in a TypeScript application.
   * @param {number} Id - The parameter `Id` is a number representing the unique identifier of a course
   * that we want to retrieve from the database.
   * @returns a Promise that resolves to the result of querying the database for a course with the
   * specified Id. The result is obtained using the `findOne` method of the `cursoModel` object. If an
   * error occurs during the query, the function will log the error message and throw an
   * `InternalServerErrorException` with a custom error message.
   */
  async getOneById(Id:number){
    try {
      return await this.cursoModel.findOne({ where:{ Id } });
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException('ERROR OBTENER CURSO');
    }
  }


}
