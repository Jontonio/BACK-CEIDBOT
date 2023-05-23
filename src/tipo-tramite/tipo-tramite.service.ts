import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateTipoTramiteDto } from './dto/create-tipo-tramite.dto';
import { TipoTramite } from './entities/tipo-tramite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HandleTipoTramite } from 'src/class/global-handles';
import { UpdateTipoTramiteDto } from './dto/update-tipo-tramite.dto';

@Injectable()
export class TipoTramiteService {

  constructor(@InjectRepository(TipoTramite) 
  private tipoTramiteModel:Repository<TipoTramite>){}

  async create(createTipoTramiteDto: CreateTipoTramiteDto) {
    try {
      const existTipoTramite = await this.tipoTramiteModel.findOneBy({ TipoTramite:createTipoTramiteDto.TipoTramite });
      if(existTipoTramite){
        throw new ConflictException(`El tipo de trámite ya esta registado. Considere una nueva.`);
      }
      const tipoTramite = await this.tipoTramiteModel.save(createTipoTramiteDto);
      return new HandleTipoTramite('Tipo de trámite registrado correctamente', true, tipoTramite);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR REGISTER TIPO TRAMITE');
    }
  }

  async update(Id:number, updateTipoTramiteDto: UpdateTipoTramiteDto) {
    try {
      const existTipoModel = await this.tipoTramiteModel.findOneBy({ Id });
      if(!existTipoModel){
          throw new NotFoundException(`El denominación de servicio con ${Id} no existe`);
      }
      const { affected } = await this.tipoTramiteModel.update({ Id }, updateTipoTramiteDto);
      if(affected==0) return new HandleTipoTramite(`Tipo de trámite sin afectar`, false, null);
      return new HandleTipoTramite('Tipo de trámite actualizado correctamente', true, null);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR UPDATE TIPO TRAMITE');
    }
  }

  async delete(Id:number) {
    try {
      const existTipoModel = await this.tipoTramiteModel.findOneBy({ Id });
        if(!existTipoModel){
            throw new NotFoundException(`El denominación de servicio con ${Id} no existe`);
        }
        const { affected } = await this.tipoTramiteModel.update({ Id },{ Estado: false });
        if(affected==0) return new HandleTipoTramite(`Tipo de trámite sin afectar`, false, null);
      return new HandleTipoTramite('Tipo de trámite eliminado correctamente correctamente', true, null);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR ELIMINAR TIPO TRAMITE');
    }
  }

  async findAll() {
    try {
      const count = await this.tipoTramiteModel.count({ where:{Estado:true} });
      const tiposTramites = await this.tipoTramiteModel.find({ where:{ Estado:true } });
      return new HandleTipoTramite('Lista de tipos de trámites registrados', true, tiposTramites, count);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR GET LIST DE TIPO DE TRAMITES');
    }
  }

}
