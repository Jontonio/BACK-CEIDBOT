import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEstadoGrupoDto } from './dto/create-estado-grupo.dto';
import { UpdateEstadoGrupoDto } from './dto/update-estado-grupo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoGrupo } from './entities/estado-grupo.entity';
import { Repository } from 'typeorm';
import { HandleEstadoGrupo } from 'src/class/global-handles';

@Injectable()
export class EstadoGrupoService {

  constructor(@InjectRepository(EstadoGrupo) 
  private estadoGrupoModel:Repository<EstadoGrupo>){}

  async create(createEstadoGrupoDto: CreateEstadoGrupoDto) {
    try {
      const estadoGrupo = await this.estadoGrupoModel.save(createEstadoGrupoDto);
      return new HandleEstadoGrupo(`Estado de grupo ${estadoGrupo.EstadoGrupo} creado correctamente`, true, estadoGrupo);
    } catch (e) {
      throw new InternalServerErrorException('ERROR GET TODOS LOS ESTADOS DE GRUPO');
    }
  }

  async findAll() {
    try {
      const listaEstadoGrupo = await this.estadoGrupoModel.find();
      if(listaEstadoGrupo.length==0){
        return new HandleEstadoGrupo(`Lista de estados de grupo vacía. Registre estados antes de crear nuevos grupos`, false, []);
      }
      return new HandleEstadoGrupo(`Lista de estados de grupo registrados`, true, listaEstadoGrupo);
    } catch (e) {
      throw new InternalServerErrorException('ERROR GET TODOS LOS ESTADOS DE GRUPO');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} estadoGrupo`;
  }

  update(id: number, updateEstadoGrupoDto: UpdateEstadoGrupoDto) {
    return `This action updates a #${id} estadoGrupo`;
  }

  remove(id: number) {
    return `This action removes a #${id} estadoGrupo`;
  }
}
