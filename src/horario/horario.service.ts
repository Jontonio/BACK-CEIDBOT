import { Injectable, InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleHorario } from 'src/class/global-handles';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { Horario } from './entities/horario.entity';

@Injectable()
export class HorarioService {

  constructor(@InjectRepository(Horario) 
               private horarioModel:Repository<Horario>){}

  async create(createHorarioDto: CreateHorarioDto) {
    try {
      const horario = await this.horarioModel.save(createHorarioDto)
      return new HandleHorario(`Nuevo horario registrado correctamente`, true, horario);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_CREATE_HORARIO');
    }
  }

  async findAll({ limit, offset }: PaginationQueryDto) {
    try {
      const count = await this.horarioModel.countBy({ Estado:true });
      const data = await this.horarioModel.find({ 
                                              where:{ Estado:true }, 
                                              skip:offset, take:limit });
      return new HandleHorario('Lista de horarios registrados', true, data, count);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_CREATE_HORARIO');
    }
  }

  async findListHorarios() {
    try {
      const count = await this.horarioModel.countBy({ Estado:true });
      const data = await this.horarioModel.find({
        where:{ Estado:true } 
      });
      return new HandleHorario('Lista de horarios registrados', true, data, count);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_CREATE_HORARIO');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} horario`;
  }

  update(id: number, updateHorarioDto: UpdateHorarioDto) {
    return `This action updates a #${id} horario`;
  }

  remove(id: number) {
    return `This action removes a #${id} horario`;
  }
}
