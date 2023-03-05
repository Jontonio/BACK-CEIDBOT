import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
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
    
    const data = await this.rolModel.find();
    const count = await this.rolModel.count();

    return { count, data, ok:true, msg:'Lista de roles'};
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRolDto: UpdateRolDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
