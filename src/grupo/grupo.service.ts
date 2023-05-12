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
  async createTipoGrupo(createTipo: CreateTipoGrupoDto) {
    try {
      /** verifcar si ya existe un nombre similar del grupo*/
      const grupo = await this.tipoGrupoModel.findOneBy({ NombreGrupo:createTipo.NombreGrupo });
      if(grupo) return new HandleGrupo(`El ${grupo.NombreGrupo.toUpperCase()} ya está registrado`, false, null);
      const data = await this.tipoGrupoModel.save(createTipo);
      return new HandleGrupo(`Grupo ${data.NombreGrupo.toUpperCase()} registrado correctamente`, true, data);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_CREATE_TIPO_GRUPO');
    }
  }

  /** Crea el grupo  */
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
        }
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
      /** preparar fechas */
      for (let index = 1; index <= numModulos+1; index++) { // Fechas de pago
        listFechas.push({FechaPago:fecha_sum, CurrentModulo:false, grupo:{Id:grupo.Id} as Grupo, modulo: {Id:index} as Modulo});
        fecha_sum = fecha1.add(cantidadDiasModulo,'days').toDate();
      }
      // insertar datos a grupo módulo}
      console.log(listFechas)
      await this.grupoModuloModel.save(listFechas);

      return new HandleGrupo(`Grupo con código ${grupo.Id} registrado correctamente`, true, grupo);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_CREATE_GRUPO');
    }
  }

  async findTipoGrupos() {
    try {
      const count = await this.tipoGrupoModel.countBy({ Estado:true });
      const data = await this.tipoGrupoModel.find({
        where:{ Estado:true },
        order: { createdAt:'DESC' } 
      });
      return new HandleGrupo('Lista de tipo de grupos registrados', true, data, count);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_GET_TIPOS_GRUPOS');
    }
  }

  async findAllTipoGrupos({limit, offset}: PaginationQueryDto) {
    try {
      const count = await this.tipoGrupoModel.countBy({ Estado:true });
      const data = await this.tipoGrupoModel.find({ 
        where:{ Estado:true }, 
        skip:offset, take:limit,
        order: { createdAt:'DESC' } });
      return new HandleGrupo('Lista de tipo de grupos registrados', true, data, count);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_GET_TIPOS_GRUPOS');
    }
  }

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
      throw new InternalServerErrorException('ERROR_GET_GRUPOS');
    }
  }

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
      throw new InternalServerErrorException('ERROR_GET_GRUPOS_MATRICULA');
    }
  }
  
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
      throw new InternalServerErrorException('ERROR_FIND_ONE_GRUPO');
    }
  }

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
      throw new InternalServerErrorException('ERROR_FIND_ONE_GRUPO');
    }
  }

  async updateGrupo(Id: number, updateGrupoDto: UpdateGrupoDto) {
    try {
      const { affected } = await this.grupoModel.update(Id, updateGrupoDto);
      if(affected==0) return new HandleGrupo('Grupo sin afectar ', false, null)
      const grupo = await this.grupoModel.findOneBy({Id});
      return new HandleGrupo(`Grupo G-${grupo.Id} actualizado correctamente`, true, null);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('ERROR_UPDATE_GRUPO');
    }
  }

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
      console.log(e)
      throw new InternalServerErrorException('ERROR UPDATE GRUPO MODULO');
    }
  }

  async getGrupoModulos(){
    try {
      return await this.grupoModuloModel.find({
        where:{ CurrentModulo:true, grupo:{estadoGrupo: { CodeEstado:'status_en_clases' } } },
        relations:['grupo','modulo']
      });
    } catch (e) {
      throw new InternalServerErrorException("ERROR GET GRUPO MODULO")
    }
  }

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
      throw new InternalServerErrorException("ERROR REMOVE GRUPO")
    }
  }

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
      WHERE Estado != 0;
      `);
      await queryRunner.commitTransaction();
      console.log("Estados de grupos actualizados")
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
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
            WHEN FechaPago = DATE(NOW()) THEN true
            ELSE false
            END
      WHERE grupo.estadoGrupoId != 3 || grupo.Estado != 0; 
      -- Donde !=3 obviar a los grupos ya finalizados y !=0 obviar a los que ya se enceuntran eliminados 
      `);
      await queryRunner.commitTransaction();
      console.log("Modulos actuales actualizado correctamente")
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }   

  // @Cron('* */2 * * * *', { timeZone:'America/Lima' })
  // async obtenerGruposConModulosActuales(){
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     await queryRunner.query(`
  //     UPDATE grupo_modulo
  //     JOIN grupo on grupo.Id = grupo_modulo.grupoId
  //     SET grupo_modulo.CurrentModulo = CASE
  //           WHEN FechaPago = DATE(NOW()) THEN true
  //           ELSE false
  //           END
  //     WHERE grupo.estadoGrupoId != 3 || grupo.Estado != 0; 
  //     -- Donde !=3 obviar a los grupos ya finalizados y !=0 obviar a los que ya se enceuntran eliminados 
  //     `);
  //     await queryRunner.commitTransaction();
  //     console.log("fechas actualizadas")
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw error;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }



}
