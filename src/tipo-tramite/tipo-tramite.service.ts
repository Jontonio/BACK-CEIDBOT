import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTipoTramiteDto } from './dto/create-tipo-tramite.dto';
import { UpdateTipoTramiteDto } from './dto/update-tipo-tramite.dto';
import { TipoTramite } from './entities/tipo-tramite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HandleTipoTramite } from 'src/class/global-handles';

@Injectable()
export class TipoTramiteService {

  constructor(@InjectRepository(TipoTramite) 
  private tipoTramiteModel:Repository<TipoTramite>){}

  async create(createTipoTramiteDto: CreateTipoTramiteDto) {
    try {
      const tipoTramite = await this.tipoTramiteModel.save(createTipoTramiteDto);
      return new HandleTipoTramite('Tipo de trámite registrado correctamente', true, tipoTramite);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR REGISTER TIPO TRAMITE');
    }
  }

  async findAll() {
    try {
      const count = await this.tipoTramiteModel.count();
      const tiposTramites = await this.tipoTramiteModel.find();
      return new HandleTipoTramite('Lista de tipos de trámites registrados', true, tiposTramites, count);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR GET LIST DE TIPO DE TRAMITES');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoTramite`;
  }

  update(id: number, updateTipoTramiteDto: UpdateTipoTramiteDto) {
    return `This action updates a #${id} tipoTramite`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoTramite`;
  }
}
