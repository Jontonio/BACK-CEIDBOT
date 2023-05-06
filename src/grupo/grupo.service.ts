import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateTipoGrupoDto } from './dto/create-tipo-grupo.dto';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { Grupo } from './entities/grupo.entity';
import { TipoGrupo } from './entities/tipo-grupo.entity';
import { HandleGrupo } from 'src/class/global-handles';
import * as moment from 'moment';

@Injectable()
export class GrupoService {
  
  constructor(@InjectRepository(Grupo) 
               private grupoModel:Repository<Grupo>,
              @InjectRepository(TipoGrupo) 
              private tipoGrupoModel:Repository<TipoGrupo>){}

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
      //TODO verificar si existe un grupo con el mismo nombre y que sea del mismo nivel y que estado se activo */
      const { NombreGrupo } = createGrupo.tipoGrupo;
      const { NombreCurso, nivel } = createGrupo.curso;
      const { Nivel } = nivel;
      const CodeEstado = 'status_matricula';
      const existsGrupo = await this.grupoModel.findOne({
        where:{ tipoGrupo:{ NombreGrupo }, 
                estadoGrupo:{ CodeEstado }, 
                curso:{ NombreCurso, nivel:{ Nivel } } 
        }
      });
      if(existsGrupo){
        return new HandleGrupo(`El grupo a registrar ya existe. Registre un nuevo grupo con un nombre diferente`, false, null);
      }
      const data = await this.grupoModel.save(createGrupo);
      return new HandleGrupo(`Grupo con código ${data.Id} registrado correctamente`, true, data);
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
        relations:['docente','horario','tipoGrupo','curso','curso.nivel','estadoGrupo']});
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
                   'estadoGrupo',
                   'estudianteEnGrupo']});
      // console.log(grupo);
      // const fecha1 = moment(grupo.FechaInicioGrupo); //fecha de inicio
      // const fecha2 = moment(grupo.FechaFinalGrupo); // fecha final
      // const fecha3 = moment().format('YYYY-MM-DD'); // fecha actual
      // const fecha4 = moment(fecha3);

      // const diasEnClases = fecha2.diff(fecha1, 'days');
      // const diasTransPassdos = fecha4.diff(fecha1, 'days');
      // console.log("Fecha inicio: ",fecha1);
      // console.log("Fecha final: ",fecha2);
      // console.log('Dias entre la fecha inicio y la fecha final: ',diasEnClases);
      // console.log('Dias pasados hasta ahora: ', diasTransPassdos);
      // // Calcula la cantidad de días que tiene cada módulo en el curso:
      // const numModulos = grupo.curso.NumModulos;
      // const cantidadDiasModulo = Math.floor(diasEnClases / numModulos);
      // console.log('Días por módulo: ', cantidadDiasModulo)
      // //calcula los modulos completados
      // const modulosCumplidos = Math.floor(diasTransPassdos / cantidadDiasModulo);
      // console.log('Modulos cumplidos: ',modulosCumplidos);
      // console.log('Modulo actual: ',modulosCumplidos<numModulos?modulosCumplidos:modulosCumplidos+1);
      // for (let index = 1; index <= numModulos; index++) {
      //   console.log(`Fecha pago ${index}: `, fecha1.add(cantidadDiasModulo,'days').format('YYYY-MM-DD'))
      // }

      return new HandleGrupo('Un grupo encontrado', true, grupo);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_FIND_ONE_GRUPO');
    }
  }

  async findOne(Id: number) {
    try {
      return await this.grupoModel.findOne({ 
        where:{ Id }, 
        relations:['tipoGrupo','curso','curso.nivel','docente']
      });
    } catch (e) {
      throw new InternalServerErrorException('ERROR_FIND_ONE_GRUPO');
    }
  }

  async update(Id: number, updateGrupoDto: UpdateGrupoDto) {
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

  remove(id: number) {
    return `This action removes a #${id} grupo`;
  }

  async getOneById(Id:number){
    return await this.grupoModel.findOne({ where:{ Id } });
  }
}
