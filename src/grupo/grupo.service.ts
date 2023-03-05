import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { Grupo } from './entities/grupo.entity';

@Injectable()
export class GrupoService {
  
  constructor(@InjectRepository(Grupo) 
               private grupoModel:Repository<Grupo>){}

  async create(createGrupoDto: CreateGrupoDto) {
    /** verifcar si ya existe un nombre similar del grupo*/
    const grupo = await this.grupoModel.findOneBy({ NombreGrupo:createGrupoDto.NombreGrupo });
    if(grupo){
      return { msg:`El ${grupo.NombreGrupo.toUpperCase()} ya está registrado`, ok:false, data:'' };
    }
    const data = await this.grupoModel.save(createGrupoDto);
    return { msg:`Grupo ${data.NombreGrupo.toUpperCase()} registrado correctamente`, ok:true, data };
  }

  findAll() {
    return `This action returns all grupo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} grupo`;
  }

  update(id: number, updateGrupoDto: UpdateGrupoDto) {
    return `This action updates a #${id} grupo`;
  }

  remove(id: number) {
    return `This action removes a #${id} grupo`;
  }
}
