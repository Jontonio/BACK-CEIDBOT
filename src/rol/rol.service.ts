import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRolDto } from './dto/create-rol.dto';
import { Rol } from './entities/rol.entity';

@Injectable()
export class RolService {

  constructor(@InjectRepository(Rol) 
  private rolModel:Repository<Rol>){}

  async create(createRolDto: CreateRolDto) {
    const data = await this.rolModel.save(createRolDto);
    return {data, ok:true, msg:'Nuevo rol registrado correctamente'};
  }

  async findAll() {
    const count = await this.rolModel.count();
    const data = await this.rolModel.find();
    return { count, data, ok:true, msg:'Lista de roles'};
  }

}
