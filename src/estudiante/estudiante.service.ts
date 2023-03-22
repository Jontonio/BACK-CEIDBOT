import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleEstudiante } from 'src/class/global-handles';
import { Repository } from 'typeorm';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { Estudiante } from './entities/estudiante.entity';

@Injectable()
export class EstudianteService {

  constructor(@InjectRepository(Estudiante) 
              private estudianteModel:Repository<Estudiante>){}

  async create(createEstudianteDto: CreateEstudianteDto) {
    try {
      const estudiante = await this.estudianteModel.save(createEstudianteDto);
      return new HandleEstudiante(`Estudiante ${estudiante.Nombres} registrado correctamente`, true, estudiante);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_CREATE_ESTUDIANTE');
    }
  }

  async saveEstudiante(createEstudianteDto: CreateEstudianteDto) {
    try {
      return await this.estudianteModel.save(createEstudianteDto);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_CREATE_ESTUDIANTE');
    }
  }

  findAll() {
    return `This action returns all estudiante`;
  }

  findOne(id: number) {
    return `This action returns a #${id} estudiante`;
  }

  update(id: number, updateEstudianteDto: UpdateEstudianteDto) {
    return `This action updates a #${id} estudiante`;
  }

  remove(id: number) {
    return `This action removes a #${id} estudiante`;
  }
}
