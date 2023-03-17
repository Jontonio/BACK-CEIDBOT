import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleInstitucion } from 'src/class/global-handles';
import { Repository } from 'typeorm';
import { CreateInstitucionDto } from './dto/create-institucion.dto';
import { UpdateInstitucionDto } from './dto/update-institucion.dto';
import { Institucion } from './entities/institucion.entity';

@Injectable()
export class InstitucionService {
  constructor(@InjectRepository(Institucion) 
              private instituModel:Repository<Institucion>){}

  async create(createInstitucionDto: CreateInstitucionDto) {
    try {
      const institucion = await this.instituModel.save(createInstitucionDto);
      return new HandleInstitucion(`Institución ${institucion.NombreInstitucion} registrado correctamente`, true, institucion);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_CREATE_INSTITUCION');
    }
  }

  findAll() {
    return `This action returns all institucion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} institucion`;
  }

  update(id: number, updateInstitucionDto: UpdateInstitucionDto) {
    return `This action updates a #${id} institucion`;
  }

  remove(id: number) {
    return `This action removes a #${id} institucion`;
  }
}
