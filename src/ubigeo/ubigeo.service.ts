import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProvinviaDto } from './dto/create-distrito.dto';
import { Departamento } from './entities/departamento.entity';
import { Distrito } from './entities/distrito.entity';
import { Provincia } from './entities/provincia.entity';

@Injectable()
export class UbigeoService {

  constructor(@InjectRepository(Departamento) 
              private deparModel:Repository<Departamento>,
              @InjectRepository(Provincia) 
              private provinModel:Repository<Provincia>,
              @InjectRepository(Distrito) 
              private distModel:Repository<Distrito>){}

  async findDepartamentos(){
    try {
      return this.deparModel.find();
    } catch (e) {
      throw new InternalServerErrorException('ERROR GET DEPARTAMENTOS');
    }
  }

  async findProvincia(IdPadreUbigeo:number){
    try {
      return this.provinModel.findBy({ IdPadreUbigeo });
    } catch (e) {
      throw new InternalServerErrorException('ERROR GET PROVINCIAS BY UBIGEO');
    }
  }

  async findDistrito(IdPadreUbigeo:number){
    try {
      return this.distModel.find({ where:{ IdPadreUbigeo }, order:{ NombreDistrito:'ASC'} });
    } catch (e) {
      throw new InternalServerErrorException('ERROR GET DISTRITO BY UBIGEO');
    }
  }
  
}
