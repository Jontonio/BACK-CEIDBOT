import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleInstitucion } from 'src/class/global-handles';
import { Repository } from 'typeorm';
import { CreateInstitucionDto } from './dto/create-institucion.dto';
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

  async saveInstitucion(createInstitucionDto: CreateInstitucionDto) {
    try {
      return await this.instituModel.save(createInstitucionDto);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_CREATE_INSTITUCION');
    }
  }

  async remove(Id: number) {
    try {
      const institucion = await this.instituModel.findOne({where:{Id}});
      if(!institucion){
        throw new NotFoundException(`No se encontro a la institución con el Id ${Id}`);
      }
      return await this.instituModel.delete({Id});
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_REMOVE_INSTITUCION');
    }
  }
}
