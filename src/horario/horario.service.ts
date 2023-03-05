import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  findAll() {
    return `This action returns all horario`;
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
