import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateTipoGrupoDto } from './dto/create-tipo-grupo.dto';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { Grupo } from './entities/grupo.entity';
import { TipoGrupo } from './entities/tipo-grupo.entity';
import { HandleGrupo, HandleGrupoModulo } from 'src/class/global-handles';
import * as moment from 'moment';
import { GrupoModulo } from './entities/grupoModulo.entity';
import { CreateGrupoModuloDto } from './dto/create-grupo-modulo.dto copy';
import { Modulo } from 'src/curso/entities/modulo.entity';
import { UpdateGrupoModuloDto } from './dto/update-grupo-modulo.dto';
import { Cron } from '@nestjs/schedule';
import { DataHorizontalBar, DataVerticalBar } from 'src/class/Graphics';

@Injectable()
export class GrupoService {
  
  constructor(private dataSource: DataSource,
              @InjectRepository(Grupo) 
               private grupoModel:Repository<Grupo>,
              @InjectRepository(TipoGrupo) 
              private tipoGrupoModel:Repository<TipoGrupo>,
              @InjectRepository(GrupoModulo) 
              private grupoModuloModel:Repository<GrupoModulo>){}

  /** Crea el nombre del grupo como por ejemplo grupo A, grupo B, grupo C etc  */
  /**
   * This function creates a new group type and checks if a similar group name already exists.
   * @param {CreateTipoGrupoDto} createTipo - CreateTipoGrupoDto, which is a data transfer object
   * containing the information needed to create a new tipo grupo (group type).
   * @returns an instance of the `HandleGrupo` class with a message, a boolean value indicating if the
   * operation was successful, and either the data created or null.
   */
  async createTipoGrupo(createTipo: CreateTipoGrupoDto) {
    try {
      /** verifcar si ya existe un nombre similar del grupo*/
      const grupo = await this.tipoGrupoModel.findOneBy({ NombreGrupo:createTipo.NombreGrupo });
      if(grupo) return new HandleGrupo(`El ${grupo.NombreGrupo.toUpperCase()} ya está registrado`, false, null);
      const data = await this.tipoGrupoModel.save(createTipo);
      return new HandleGrupo(`Grupo ${data.NombreGrupo.toUpperCase()} registrado correctamente`, true, data);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR CREAR TIPO GRUPO');
    }
  }

  /** Crea el grupo  */

  /**
   * This function creates a new group and calculates the payment dates for each module of the course.
   * @param {CreateGrupoDto} createGrupo - The parameter `createGrupo` is an object of type
   * `CreateGrupoDto` which contains information about a group to be created, including the type of
   * group, the course it belongs to, and its start and end dates.
   * @returns an instance of the `HandleGrupo` class with a message, a boolean value indicating success
   * or failure, and either the newly created `grupo` object or `null` depending on the success of the
   * operation.
   */
  async createGrupo(createGrupo: CreateGrupoDto) {
    try {
      // verificar si existe un grupo con el mismo nombre y que sea del mismo nivel y que estado se activo */
      const { NombreGrupo } = createGrupo.tipoGrupo;
      const { NombreCurso, nivel } = createGrupo.curso;
      const { Nivel } = nivel;
      const CodeEstado = 'status_matricula';
      const existsGrupo = await this.grupoModel.findOne({
        where:{ 
          tipoGrupo:{ NombreGrupo }, 
          estadoGrupo:{ CodeEstado }, 
          curso:{ NombreCurso, nivel:{ Nivel } } 
        },
        relations:['tipoGrupo','estadoGrupo','curso']
      });

      if(existsGrupo){
        return new HandleGrupo(`El grupo a registrar ya existe. Registre un nuevo grupo con un nombre diferente`, false, null);
      }
      /** registrar grupo */
      const grupo = await this.grupoModel.save(createGrupo);
      /** obtener sus posibles fechas de pago en dias calendarios */
      const fecha1 = moment(grupo.FechaInicioGrupo); // fecha de inicio del grupo
      const fecha2 = moment(grupo.FechaFinalGrupo);  // fecha final del grupo
      const numModulos = grupo.curso.modulo.Modulo;     // numero de modulos del curso
      const diasEnClases = fecha2.diff(fecha1, 'days');     // Cantidad de dias desde el inicio hasta el final
      const cantidadDiasModulo = Math.floor(diasEnClases / numModulos); // Numero de dias por modulo del curso
      const listFechas:CreateGrupoModuloDto[] = [];
      let fecha_sum = fecha1.toDate();
      let fecha_finalModulo = moment(fecha_sum).add(cantidadDiasModulo,'days').subtract(1,'days').toDate();
      /** preparar fechas */
      for (let index = 1; index <= numModulos; index++) { // Fechas de pago
        listFechas.push({ FechaPago:fecha_sum, 
                          FechaFinalModulo: fecha_finalModulo, 
                          CurrentModulo:false, 
                          grupo:{ Id:grupo.Id } as Grupo, 
                          modulo:{ Id:index } as Modulo});
        fecha_sum = fecha1.add(cantidadDiasModulo,'day').toDate();
        fecha_finalModulo = moment(fecha_sum).add(cantidadDiasModulo,'days').subtract(1, 'days').toDate();
      }
      // insertar datos a grupo módulo}
      await this.grupoModuloModel.save(listFechas);

      return new HandleGrupo(`Grupo con código ${grupo.Id} registrado correctamente`, true, grupo);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR REGISTRAR GRUPO');
    }
  }

/**
 * This function finds and returns a list of registered group types with their count.
 * @returns A HandleGrupo object with a message, a boolean indicating success, an array of data
 * containing information about registered types of groups, and a count of the number of registered
 * types of groups.
 */
  async findTipoGrupos() {
    try {
      const count = await this.tipoGrupoModel.countBy({ Estado:true });
      const data = await this.tipoGrupoModel.find({
        where:{ Estado:true },
        order: { createdAt:'DESC' } 
      });
      return new HandleGrupo('Lista de tipo de grupos registrados', true, data, count);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTNER GRUPOS');
    }
  }

  /**
   * This function retrieves a list of registered group types with pagination and returns it along with
   * a success message and count.
   * @param {PaginationQueryDto}  - - `limit`: The maximum number of items to return in the result set.
   * @returns This function is returning a HandleGrupo object that contains a message, a boolean value
   * indicating if the operation was successful or not, an array of data (tipo de grupos), and a count
   * of the total number of tipo de grupos that meet the criteria.
   */
  async findAllTipoGrupos({limit, offset}: PaginationQueryDto) {
    try {
      const count = await this.tipoGrupoModel.countBy({ Estado:true });
      const data = await this.tipoGrupoModel.find({ 
        where:{ Estado:true }, 
        skip:offset, take:limit,
        order: { createdAt:'DESC' } });
      return new HandleGrupo('Lista de tipo de grupos registrados', true, data, count);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER TIPOS GRUPOS');
    }
  }

  /**
   * This function finds all active groups with pagination and related entities and returns them with a
   * count.
   * @param {PaginationQueryDto}  - - `limit`: The maximum number of items to return in the result set.
   * @returns an object of type `HandleGrupo` which contains a message, a boolean value indicating if
   * the operation was successful, an array of `grupos` (groups) and a `count` of the total number of
   * groups.
   */
  async findAllGrupos({limit, offset}: PaginationQueryDto) {
    try {
      const count = await this.grupoModel.countBy({ Estado:true });
      const grupos = await this.grupoModel.find({
        where:{ Estado:true }, 
        skip:offset, take:limit,
        order: { createdAt:'DESC' },
        relations:['docente',
                   'horario',
                   'tipoGrupo',
                   'curso',
                   'curso.nivel',
                   'estadoGrupo',
                   'grupoModulo',
                   'grupoModulo.modulo']});
      return new HandleGrupo('Lista de grupos registrados', true, grupos, count);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER GRUPOS');
    }
  }

  /**
   * This function finds all registered groups for matriculation with pagination and related entities.
   * @param {PaginationQueryDto}  - - `limit`: The maximum number of results to return.
   * @returns an object of type `HandleGrupo` which contains a message, a boolean value indicating if
   * the operation was successful, an array of `grupos` (groups) and a `count` value.
   */
  async findAllMatricula({limit, offset}: PaginationQueryDto) {
    try {
      const count = await this.grupoModel.countBy({ Estado:true });
      const grupos = await this.grupoModel.find({
        where:{ Estado:true, estadoGrupo:{ CodeEstado:'status_matricula' } }, 
        skip:offset, take:limit,
        order: { curso:{ NombreCurso:'ASC' } },
        relations:['horario',
                   'tipoGrupo',
                   'curso',
                   'curso.nivel',
                   'curso.modulo',
                   'curso.libros',
                   'estadoGrupo']});
      return new HandleGrupo('Lista de grupos registrados', true, grupos, count);
    } catch (e) {
      throw new InternalServerErrorException('ERROR OBTENER GRUPOS MATRICULA');
    }
  }

 /**
  * This function finds all groups that match a certain state and state ID, with pagination and related
  * data, and returns them in a custom object.
  * @param {number} idEstadoGrupo - The ID of the state of the group that is being searched for in the
  * database.
  * @param {PaginationQueryDto}  - - `idEstadoGrupo`: a number representing the ID of the state of the
  * group
  * @returns an object of type `HandleGrupo` which contains a message, a boolean value indicating if
  * the operation was successful, an array of `grupos` (groups) and a `count` of the total number of
  * groups that match the query.
  */
  async findAllGruposReporte(idEstadoGrupo:number ,{limit, offset}: PaginationQueryDto) {
    try {
      const query = { Estado:true, estadoGrupo:{ Id:idEstadoGrupo } }
      const count = await this.grupoModel.countBy( query );
      const grupos = await this.grupoModel.find({
        where:query, 
        skip:offset, take:limit,
        order: { curso:{ NombreCurso:'ASC' } },
        relations:['horario',
                   'tipoGrupo',
                   'curso',
                   'curso.nivel',
                   'curso.modulo']});
      return new HandleGrupo('Lista de grupos registrados', true, grupos, count);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER GRUPOS REPORTE');
    }
  }
  
 /**
  * This function finds a group by its ID and returns it with related data.
  * @param {number} Id - The parameter `Id` is a number that represents the unique identifier of a
  * group. It is used to search for a specific group in the database.
  * @returns an object of type `HandleGrupo` with a message, a boolean value indicating if the group
  * was found or not, and the group object itself.
  */
  async findOneGrupo(Id: number) {
    try {
      const grupo = await this.grupoModel.findOne({ 
        where:{ Id }, 
        relations:['docente',
                   'horario',
                   'tipoGrupo',
                   'curso',
                   'curso.nivel',
                   'curso.libros',
                   'curso.modulo',
                   'estadoGrupo',
                   'estudianteEnGrupo',
                   'grupoModulo',
                   'grupoModulo.modulo']});
      return new HandleGrupo('Un grupo encontrado', true, grupo);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER UN GRUPO');
    }
  }

 /**
  * This is an asynchronous function that finds a group by its ID and returns it with its related data.
  * @param {number} Id - The parameter "Id" is a number that represents the unique identifier of a
  * group. This function uses this parameter to search for a group in the database and return its
  * information along with some related entities.
  * @returns The `findOne` method is returning a Promise that resolves to a single `Grupo` object that
  * matches the provided `Id`. The `Grupo` object includes related entities such as `tipoGrupo`,
  * `curso`, `docente`, `grupoModulo`, and their respective related entities. If an error occurs, an
  * `InternalServerErrorException` is thrown with the message "ERROR OBTENER UN GRU
  */
  async findOne(Id: number) {
    try {
      return await this.grupoModel.findOne({ 
        where:{ Id }, 
        relations:['tipoGrupo',
                   'curso',
                   'curso.nivel',
                   'curso.modulo',
                   'docente',
                   'grupoModulo',
                   'grupoModulo.modulo']
      });
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER UN GRUPO');
    }
  }

  /**
   * This is an async function that updates a group and returns a message indicating whether the update
   * was successful or not.
   * @param {number} Id - The Id parameter is a number that represents the unique identifier of a
   * group.
   * @param {UpdateGrupoDto} updateGrupoDto - UpdateGrupoDto is a data transfer object that contains
   * the updated information for a group. It is used to update the group with the specified Id in the
   * database.
   * @returns an instance of the `HandleGrupo` class with a message indicating whether the update was
   * successful or not, and a boolean value indicating the success status. The `null` value is being
   * returned as the third parameter of the `HandleGrupo` constructor, which is not being used in this
   * case.
   */
  async updateGrupo(Id: number, updateGrupoDto: UpdateGrupoDto) {
    try {
      const { affected } = await this.grupoModel.update(Id, updateGrupoDto);
      if(affected==0) return new HandleGrupo('Grupo sin afectar ', false, null)
      const grupo = await this.grupoModel.findOneBy({Id});
      return new HandleGrupo(`Grupo G-${grupo.Id} actualizado correctamente`, true, null);
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException('ERROR ACTUALIZAR GRUPO');
    }
  }

  /**
   * This is an async function that updates the payment date of a group module and performs some
   * validations before updating.
   * @param {number} Id - The ID of the grupo módulo that needs to be updated.
   * @param {UpdateGrupoModuloDto} updateGrupoModuloDto - `updateGrupoModuloDto` is an object that
   * contains the data needed to update a group module. It has two properties: `grupo` and `FechaPago`.
   * `grupo` is an object that contains the ID of the group to be updated, while `FechaPago` is the
   * date of
   * @returns an instance of the `HandleGrupoModulo` class, which contains a message, a boolean
   * indicating success or failure, and possibly some data.
   */
  async updateGrupoModelo(Id:number, updateGrupoModuloDto:UpdateGrupoModuloDto){
    try {
      const { grupo, FechaPago } = updateGrupoModuloDto;
      // verificar si existe el grupo
      const existsGrupo = await this.grupoModel.findOneBy({ Id: grupo.Id });
      if(!existsGrupo){
        return new HandleGrupoModulo(`El grupo G-${grupo.Id} no encontrado`, false, null);
      }
      // verificar si las fechas se encuentran el el rango de fecha inicio y final del grupo
      const grupoFechInicio = moment(existsGrupo.FechaInicioGrupo);
      const grupoFechFinal  = moment(existsGrupo.FechaFinalGrupo);
      const fechaPapo       = moment(FechaPago);
      const diferenciaInicioDias = grupoFechInicio.diff(fechaPapo, 'days');
      const diferenciaFinalDias  = fechaPapo.diff(grupoFechFinal, 'days');
      if(diferenciaInicioDias > 0){
        return new HandleGrupoModulo(`Las fecha de pago tiene que ser en el rango de la fecha de inicio del grupo`, false, null);
      }
      if(diferenciaFinalDias > 0){
        return new HandleGrupoModulo(`Las fecha de pago tiene que ser en el rango de la fecha de final del grupo`, false, null);
      }
      const { affected } = await this.grupoModuloModel.update(Id, updateGrupoModuloDto);
      if(affected==0) return new HandleGrupo('Grupo módulo sin afectar ', false, null)
      return new HandleGrupoModulo(`Fecha de cobro del grupo G-${grupo.Id} actualizado correctamente`, true, null);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ACTUALIZAR GRUPO MODULO');
    }
  }

 /**
  * This function retrieves a list of group modules that are currently active and belong to a group
  * with a specific status.
  * @returns The `getGrupoModulos` function is returning a promise that resolves to an array of objects
  * that match the specified criteria. The objects will have properties `grupo`, `modulo`, and
  * `CurrentModulo`. The `where` clause filters the results based on the `CurrentModulo` property being
  * true and the `estadoGrupo` property of the related `grupo` object having a `CodeEstado
  */
  async getGrupoModulos(){
    try {
      return await this.grupoModuloModel.find({
        where:{ CurrentModulo:true, grupo:{estadoGrupo: { CodeEstado:'status_en_clases' } } },
        relations:['grupo','modulo']
      });
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException("ERROR OBTENER GRUPO MODULO")
    }
  }

/**
 * This function removes a group by setting its Estado property to false and returns a success message
 * or throws an error if the group does not exist or there is an internal server error.
 * @param {number} Id - The parameter `Id` is a number representing the ID of the group to be removed.
 * @returns an instance of the `HandleGrupoModulo` class with a success message if the group with the
 * given `Id` is successfully removed, or an instance of the `HandleGrupo` class with a failure message
 * if the group module is not affected. If an error occurs during the removal process, an
 * `InternalServerErrorException` is thrown.
 */
  async remove(Id: number) {
    try {
      const existGrupo = await this.grupoModel.findOneBy({ Id });
      if(!existGrupo){
        throw new NotFoundException(`No existe el grupo G-${Id}`);
      }
      const { affected } = await this.grupoModel.update(Id, { Estado:false });
      if(affected==0) return new HandleGrupo('Grupo módulo sin afectar ', false, null)
      return new HandleGrupoModulo(`Grupo G-${Id} se ha eliminado correctamente`, true, null);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException("ERROR ELIMINAR GRUPO")
    }
  }

  /**
   * This function retrieves data for a horizontal bar chart displaying the number of students in each
   * group, filtered by a specified group state.
   * @param {number} estadoGrupoId - The parameter `estadoGrupoId` is a number that represents the ID
   * of the group state for which the horizontal bar data is being retrieved.
   * @returns an array of objects with two properties: "name" and "value". The "name" property is a
   * string that concatenates the group name, course name, and level. The "value" property is the total
   * number of students in that group. If there are no results, the function returns an array with a
   * single object with "value" set to 0 and "
   */
  async getDataHorizontalBarEstudiantesEnGrupos(estadoGrupoId:number){

    try {
      
      const query = this.grupoModel.createQueryBuilder('grupo')
          .select('grupo.Id', 'id_grupo')
          .addSelect('UPPER(tipo_grupo.NombreGrupo)', 'nombre_grupo')
          .addSelect('UPPER(curso.NombreCurso)', 'nombre_curso')
          .addSelect('nivel.Nivel', 'nivel')
          .addSelect('COUNT(estudiante_en_grupo.Id)', 'total_estudiantes')
          .leftJoin('grupo.estadoGrupo', 'estado_grupo')
          .leftJoin('grupo.tipoGrupo', 'tipo_grupo')
          .leftJoin('grupo.curso', 'curso')
          .leftJoin('curso.nivel', 'nivel')
          .leftJoin('grupo.estudianteEnGrupo', 'estudiante_en_grupo')
          .where('grupo.Estado = :estado', { estado: 1 })
          .andWhere('(estudiante_en_grupo.Estado IS NULL OR estudiante_en_grupo.Estado = :estado)', { estado: 1 })
          .andWhere('(estado_grupo.Estado IS NULL OR estado_grupo.Estado = :estado)', { estado: 1 })
          .andWhere('grupo.estadoGrupoId = :estadoGrupoId', { estadoGrupoId })
          .groupBy('grupo.Id, tipo_grupo.NombreGrupo, nivel.Nivel')

      const result = await query.getRawMany();   

      if(result.length > 0 ){
        const data:DataHorizontalBar[] = [];
        result.forEach(res => {
          data.push({name:`${res.nombre_grupo} - ${res.nombre_curso} ${res.nivel}`, value:res.total_estudiantes})
        })
        return data;
      }
      return [{value:0, name:'Sin registros'}];

    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException("ERROR OBTENER DATA HORIZONTAL GRUPOS DASHBOARD");
    }

  }

  /**
   * This function retrieves data for a vertical bar chart displaying the number of payments and late
   * payments for a specific group and its modules.
   * @param {number} grupoId - The ID of the group for which data is being fetched.
   * @param {number} estadoGrupoId - The parameter `estadoGrupoId` is an integer representing the ID of
   * the state of a group.
   * @returns an array of objects of type `DataVerticalBar` which contains information about the number
   * of payments and late payments for a given group and state. If there are no results, it returns an
   * array with a single object indicating that there are no records.
   */
  async getDataVerticalBarPagosMora(grupoId:number, estadoGrupoId:number){

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const result:any[] = await queryRunner.query(`
          SELECT CONCAT(UPPER(tipo_grupo.NombreGrupo),' ',UPPER(curso.NombreCurso),' ', nivel.Nivel) AS grupo,
                modulo.Modulo AS modulo,
                COUNT(DISTINCT CASE WHEN pago.categoriaPagoId = 1 THEN pago.Id END) AS cantidad_pago,
                COUNT(DISTINCT CASE WHEN mora.EstadoMora = 1 THEN mora.Id END) AS cantidad_mora
          FROM grupo
          JOIN tipo_grupo ON tipo_grupo.Id = grupo.tipoGrupoId
          JOIN estado_grupo ON estado_grupo.Id = grupo.estadoGrupoId
          JOIN grupo_modulo AS gm ON grupo.Id = gm.grupoId
          JOIN modulo ON gm.moduloId = modulo.Id
          JOIN curso ON grupo.cursoId = curso.Id
          JOIN nivel ON curso.nivelId = nivel.Id
          LEFT JOIN pago ON gm.Id = pago.grupoModuloId
          LEFT JOIN mora ON gm.Id = mora.grupoModuloId
          WHERE grupo.Estado = true AND grupo.Id = ${grupoId} AND estado_grupo.Id = ${estadoGrupoId}
          GROUP BY gm.Id, grupo, modulo;
        `);
        await queryRunner.commitTransaction();

        if(result.length > 0 ){
          const dataVerticalBar:DataVerticalBar[] = [];
          
          result.forEach(res => {
            dataVerticalBar.push({
              name:`Módulo ${res.modulo}`, 
              series:[
                { name:'Mensualidad', value:res.cantidad_pago }, 
                { name:'Mora', value:res.cantidad_mora }
              ]})
          })
          return dataVerticalBar;
        }
        
        return [{ name:'Sin registros', series:[{ name:'Sin registros', value:0 }] }];

    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log(e.message)
      throw new InternalServerErrorException("ERROR OBTENER DATA VERTICAL GRUPOS DASHBOARD");
    } finally {
      await queryRunner.release();
    }

  }

 /**
  * This function retrieves a single record from a database table based on its ID.
  * @param {number} Id - The parameter `Id` is a number that represents the unique identifier of a
  * record in the database. The `getOneById` function is an asynchronous function that retrieves a
  * single record from the database based on the provided `Id`. The function uses the `findOne` method
  * of the `grupoModel`
  * @returns a Promise that resolves to the result of a database query to find one record in the
  * "grupoModel" table where the "Id" column matches the provided "Id" parameter.
  */
  async getOneById(Id:number){
    return await this.grupoModel.findOne({ where:{ Id } });
  }

  /* The above code is defining a function that will run at midnight every day using a cron job. The
  function updates the state of a group based on its start and end dates. It uses a query runner to
  connect to a data source and start a transaction. It then updates the state of the group based on
  the current date and the start and end dates of the group. If the update is successful, it commits
  the transaction and logs a message. If there is an error, it rolls back the transaction and throws
  the error. Finally, it releases the query runner. 
  update estadoGrupoId 2 in process or 3 finalized a las 0 horas y 0 minutos
  */
  @Cron('0 0 0 * * *', { timeZone:'America/Lima' })
  async actualizarEstadoDelGrupo(){
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(`
      UPDATE grupo
      SET estadoGrupoId = CASE
          WHEN FechaInicioGrupo = DATE(NOW()) THEN 2
          WHEN FechaFinalGrupo = DATE(NOW()) THEN 3
          ELSE estadoGrupoId
          END
      WHERE Estado = 1;
      `);
      await queryRunner.commitTransaction();
      console.log("Estados de grupos actualizados")
    } catch (e) {
      console.log(e.message)
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException("ERROR ACTUALIZAR ESTADOS DEL GRUPO");
    } finally {
      await queryRunner.release();
    }
  }

  /* The above code is a TypeScript function that runs a cron job at 10 minutes past midnight every day
  in the "America/Lima" timezone. The function updates the "CurrentModulo" field in the
  "grupo_modulo" table based on whether the "FechaPago" field is equal to the current date or not.
  If it is equal, the "CurrentModulo" field is set to true, otherwise it is set to false. The
  function also ignores groups that have already been finalized or deleted. The function uses a
  query runner to execute the SQL update statement and handles any errors that may 
  actualizar a los módulos actuales cuya condición sea aquellos grupos con estadoGrupoId diferente de tres y cuyo estado del grupo sea diferente de 0.
  a las 0 horas y 10 minutos
  */
  @Cron('0 10 0 * * *', { timeZone:'America/Lima' })
  async actualizarCurrentModulo() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(`
      UPDATE grupo_modulo
      JOIN grupo on grupo.Id = grupo_modulo.grupoId
      SET grupo_modulo.CurrentModulo = CASE
            WHEN DATE(NOW()) BETWEEN FechaPago AND FechaFinalModulo THEN true
            ELSE false
            END
      WHERE grupo.estadoGrupoId != 3 || grupo.Estado = 1;
      -- Donde !=3 obviar a los grupos ya finalizados y !=0 obviar a los que ya se enceuntran eliminados 
      `);
      await queryRunner.commitTransaction();
      console.log("Modulos actuales actualizado correctamente")
    } catch (e) {
      console.log(e.message)
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException("ERROR ACTUALIZAR MODULO ACTUAL");
    } finally {
      await queryRunner.release();
    }
    
  }   

}
