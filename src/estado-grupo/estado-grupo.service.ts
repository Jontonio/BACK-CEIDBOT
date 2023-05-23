import { Injectable, InternalServerErrorException, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateEstadoGrupoDto } from './dto/create-estado-grupo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoGrupo } from './entities/estado-grupo.entity';
import { Repository } from 'typeorm';
import { HandleEstadoGrupo } from 'src/class/global-handles';
import { UpdateEstadoGrupoDto } from './dto/update-estado-grupo.dto';

@Injectable()
export class EstadoGrupoService {

  constructor(@InjectRepository(EstadoGrupo) 
  private estadoGrupoModel:Repository<EstadoGrupo>){}

  async create(createEstadoGrupoDto: CreateEstadoGrupoDto) {
    try {
      const existEstado = await this.estadoGrupoModel.findOneBy({ EstadoGrupo:createEstadoGrupoDto.EstadoGrupo, Estado:true });
      if(existEstado){
        throw new ConflictException(`El estado del grupo ya esta registado. Considere una nueva.`);
      }
      const estadoGrupo = await this.estadoGrupoModel.save(createEstadoGrupoDto);
      return new HandleEstadoGrupo(`Estado de grupo ${estadoGrupo.EstadoGrupo} creado correctamente`, true, estadoGrupo);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async update(Id:number, updateEstadoGrupoDto: UpdateEstadoGrupoDto) {
    try {
      const existTipoMedioPago = await this.estadoGrupoModel.findOneBy({ Id });
      if(!existTipoMedioPago){
        throw new NotFoundException(`El estado de grupo con ${Id} no existe`);
      }
      const { affected } = await this.estadoGrupoModel.update({Id}, updateEstadoGrupoDto);
      if(affected==0) return new HandleEstadoGrupo(`Estado de grupo sin afectar`, false, null);
      return new HandleEstadoGrupo('Estado de grupo actualizado correctamente', true, null);

    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException(e.message)
    }
  }

  async delete(Id:number) {
    try {
      const existTipoMedioPago = await this.estadoGrupoModel.findOneBy({ Id });
      if(!existTipoMedioPago){
        throw new NotFoundException(`El estado de grupo con ${Id} no existe`);
      }
      const { affected } = await this.estadoGrupoModel.update({Id}, { Estado: false });
      if(affected==0) return new HandleEstadoGrupo(`Estado de grupo sin afectar`, false, null);
      return new HandleEstadoGrupo('Estado de grupo eliminado correctamente', true, null);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException(e.message)
    }
  }

  async findAll() {
    try {
      const listaEstadoGrupo = await this.estadoGrupoModel.find({ where:{ Estado: true } });
      if(listaEstadoGrupo.length==0){
        return new HandleEstadoGrupo(`Lista de estados de grupo vacía. Registre estados antes de crear nuevos grupos`, false, []);
      }
      return new HandleEstadoGrupo(`Lista de estados de grupo registrados`, true, listaEstadoGrupo);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
