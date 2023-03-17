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

@Injectable()
export class GrupoService {
  
  constructor(@InjectRepository(Grupo) 
               private grupoModel:Repository<Grupo>,
              @InjectRepository(TipoGrupo) 
              private tipoGrupoModel:Repository<TipoGrupo>){}

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

  async createGrupo(createGrupo: CreateGrupoDto) {
    try {
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
                                              order: { createdAt:'DESC' } });
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
        relations:['docente','horario','tipoGrupo','curso']});
      return new HandleGrupo('Lista de grupos registrados', true, grupos, count);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_GET_GRUPOS');
    }
  }
  
  async findOneGrupo(Id: number) {
    try {
      const data = await this.grupoModel.findOne({ where:{ Id }, 
                                                relations:['docente','horario','tipoGrupo','curso']});
      return new HandleGrupo('Un grupo encontrado', true, data);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_FIND_ONE_GRUPO');
    }
  }

  update(id: number, updateGrupoDto: UpdateGrupoDto) {
    return `This action updates a #${id} grupo`;
  }

  remove(id: number) {
    return `This action removes a #${id} grupo`;
  }

  async getOneById(Id:number){
    return await this.grupoModel.findOne({ where:{ Id } });
  }
}
