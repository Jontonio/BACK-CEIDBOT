import { Injectable, InternalServerErrorException} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleApoderado } from 'src/class/global-handles';
import { Repository } from 'typeorm';
import { CreateApoderadoDto } from './dto/create-apoderado.dto';
import { Apoderado } from './entities/apoderado.entity';

@Injectable()
export class ApoderadoService {
  
  constructor(@InjectRepository(Apoderado) 
              private apoderadoModel:Repository<Apoderado>){}

  async create(createApoderadoDto: CreateApoderadoDto) {
    try {
      const apoderado = await this.apoderadoModel.save(createApoderadoDto);
      return new HandleApoderado(`Apoderado ${apoderado.NomApoderado} registrado correctamente`, true, apoderado);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_CREATE_APODERADO');
    }
  }

  async saveApoderado(createApoderadoDto: CreateApoderadoDto) {
    try {
      return await this.apoderadoModel.save(createApoderadoDto);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_CREATE_APODERADO');
    }
  }

  async findOne(DNI: string) {
    try {
      const apoderado = await this.apoderadoModel.findOne({ where:{ Documento:DNI } });
      return new HandleApoderado('get apoderado', apoderado?true:false, apoderado);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_GET_APODERADO');
    }
  }

  async remove(Id: number) {
    try {
      const apoderado = await this.apoderadoModel.findOne({where:{Id}});
      if(!apoderado){
        throw new NotFoundException(`No se encontro al apoderado con el Id ${Id}`);
      }
      return await this.apoderadoModel.delete({Id});
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_REMOVE_APODERADO');
    }
  }
}
