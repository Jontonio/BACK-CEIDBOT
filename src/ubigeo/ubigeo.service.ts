import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProvinviaDto } from './dto/create-distrito.dto';
import { UpdateUbigeoDto } from './dto/update-distrito.dto';
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

  create(createUbigeoDto: CreateProvinviaDto) {
    return 'This action adds a new ubigeo';
  }

  async findDepartamentos(){
    return this.deparModel.find();
  }

  async findProvincia(IdPadreUbigeo:number){
    return this.provinModel.findBy({ IdPadreUbigeo });
  }

  async findDistrito(IdPadreUbigeo:number){
    return this.distModel.find({ where:{ IdPadreUbigeo }, order:{ NombreDistrito:'ASC'} });
  }
  
}
