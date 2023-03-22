import { Injectable, InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleApoderado } from 'src/class/global-handles';
import { Repository } from 'typeorm';
import { CreateApoderadoDto } from './dto/create-apoderado.dto';
import { UpdateApoderadoDto } from './dto/update-apoderado.dto';
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

  findAll() {
    return `This action returns all apoderado`;
  }

  findOne(id: number) {
    return `This action returns a #${id} apoderado`;
  }

  update(id: number, updateApoderadoDto: UpdateApoderadoDto) {
    return `This action updates a #${id} apoderado`;
  }

  remove(id: number) {
    return `This action removes a #${id} apoderado`;
  }
}
