import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    const horario = await this.horarioModel.save(createHorarioDto)
    return { msg:`Nuevo horario registrado correctamente`, ok:true, data:horario };
  }

  async findAll({ limit, offset }: PaginationQueryDto) {
    const count = await this.horarioModel.countBy({ Estado:true });
    const data = await this.horarioModel.find({ 
                                            where:{ Estado:true }, 
                                            skip:offset, take:limit });
    return { data, count, ok:true, msg:'Lista de horarios registrados'};
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
