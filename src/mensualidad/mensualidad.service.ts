import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMensualidadDto } from './dto/create-mensualidad.dto';
import { UpdateMensualidadDto } from './dto/update-mensualidad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mensualidad } from './entities/mensualidad.entity';
import { Repository } from 'typeorm';
import { FirstMensualidadDto } from './dto/first-mensualidad.dto';
import { HandleMensualidad } from 'src/class/global-handles';

@Injectable()
export class MensualidadService {

  constructor(@InjectRepository(Mensualidad) 
               private mensualidadModel:Repository<Mensualidad>){}

  create(createMensualidadDto: CreateMensualidadDto) {
    return 'This action adds a new mensualidad';
  }

  async firstCreate(firstMensualidadDto: FirstMensualidadDto){
    try {
      return await this.mensualidadModel.save(firstMensualidadDto);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_REGISTER_ESTUDIANTE_EN_GRUPO');
    }
  }

  findAll() {
    return `This action returns all mensualidad`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mensualidad`;
  }

  update(id: number, updateMensualidadDto: UpdateMensualidadDto) {
    return `This action updates a #${id} mensualidad`;
  }

  remove(id: number) {
    return `This action removes a #${id} mensualidad`;
  }
}
