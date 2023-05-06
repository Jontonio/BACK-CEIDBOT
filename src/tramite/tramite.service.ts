import { Injectable } from '@nestjs/common';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tramite } from './entities/tramite.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TramiteService {

  constructor(@InjectRepository(Tramite) 
  private tramiteModel:Repository<Tramite>){}

  create(createTramiteDto: CreateTramiteDto) {
    return 'This action adds a new tramite';
  }

  findAll() {
    return `This action returns all tramite`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tramite`;
  }

  update(id: number, updateTramiteDto: UpdateTramiteDto) {
    return `This action updates a #${id} tramite`;
  }

  remove(id: number) {
    return `This action removes a #${id} tramite`;
  }
}
