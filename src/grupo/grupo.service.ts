import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateTipoGrupoDto } from './dto/create-tipo-grupo.dto';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { Grupo } from './entities/grupo.entity';
import { TipoGrupo } from './entities/tipo-grupo.entity';

@Injectable()
export class GrupoService {
  
  constructor(@InjectRepository(Grupo) 
               private grupoModel:Repository<Grupo>,
              @InjectRepository(TipoGrupo) 
              private tipoGrupoModel:Repository<TipoGrupo>){}

  async createTipoGrupo(createTipo: CreateTipoGrupoDto) {
    /** verifcar si ya existe un nombre similar del grupo*/
    const grupo = await this.tipoGrupoModel.findOneBy({ NombreGrupo:createTipo.NombreGrupo });
    if(grupo){
      return { msg:`El ${grupo.NombreGrupo.toUpperCase()} ya está registrado`, ok:false, data:'' };
    }
    const data = await this.tipoGrupoModel.save(createTipo);
    return { msg:`Grupo ${data.NombreGrupo.toUpperCase()} registrado correctamente`, ok:true, data };
  }

  async createGrupo(createGrupo: CreateGrupoDto) {
    const data = await this.grupoModel.save(createGrupo);
    return { msg:`Grupo con código ${data.Id} registrado correctamente`, ok:true, data };
  }

  async findAllTipoGrupos({limit, offset}: PaginationQueryDto) {
    const count = await this.tipoGrupoModel.countBy({ Estado:true });
    const data = await this.tipoGrupoModel.find({ 
                                            where:{ Estado:true }, 
                                            skip:offset, take:limit,
                                            order: { createdAt:'DESC' } });
    return { data, count, ok:true, msg:'Lista de tipo de grupos registrados'};
  }

  async findAllGrupos({limit, offset}: PaginationQueryDto) {
    const count = await this.grupoModel.countBy({ Estado:true });
    const data = await this.grupoModel.find({ 
                                            where:{ Estado:true }, 
                                            skip:offset, take:limit,
                                            order: { createdAt:'DESC' },
                                            relations:['docente','horario','tipoGrupo','curso']});
    return { data, count, ok:true, msg:'Lista de grupos registrados'};
  }
  
  async findOneGrupo(Id: number) {
    const data = await this.grupoModel.findOne({ where:{ Id }, 
                                              relations:['docente','horario','tipoGrupo','curso']});
                                              console.log(data);
    return { data, ok:true, msg:'Un grupo encontrado' };
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
