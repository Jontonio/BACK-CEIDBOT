import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateNivelDto } from './dto/create-nivel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Nivel } from './entities/nivel.entity';
import { Repository } from 'typeorm';
import { HandleNivel } from 'src/class/global-handles';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';

@Injectable()
export class NivelService {
  
  constructor(@InjectRepository(Nivel) 
               private nivelModel:Repository<Nivel>){}

  async create(createNivelDto: CreateNivelDto) {
    try {
      const nivel = await this.nivelModel.save(createNivelDto)
      return new HandleNivel(`Nuevo nivel registrado correctamente`, true, nivel);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_CREATE_NIVEL');
    }
  }

  async findAll({offset, limit}: PaginationQueryDto) {
    try {
      const count = await this.nivelModel.countBy( { Estado:true } );
      const data = await this.nivelModel.find({
        where:{ Estado:true }, 
        skip:offset, take:limit 
      });
      return new HandleNivel('Lista de niveles registrados', true, data, count);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_GET_ALL_NIVELES');
    }
  }

}
