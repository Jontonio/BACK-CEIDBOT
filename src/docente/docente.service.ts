import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import { Docente } from './entities/docente.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class DocenteService {

  constructor(@InjectRepository(Docente) 
               private docenteModel:Repository<Docente>){}

  async create(createDocenteDto: CreateDocenteDto) {
    const docente = await this.docenteModel.save(createDocenteDto)
    return {msg:`Docente ${docente.Nombres} registrados correctamente`, ok:true, data:docente };
  }

  async findAll({limit, offset}:PaginationQueryDto) {
    const count = await this.docenteModel.countBy({Estado:true});
    const docentes = await this.docenteModel.find(
                                { where:{ Estado:true }, 
                                  skip:offset, 
                                  take:limit, 
                                  order: {
                                    createdAt:'DESC'
                                  } 
                                });
    return {data:docentes, count, ok:true, msg:'Get all docentes from DB'};
  }

  findOne(id: number) {
    return `This action returns a #${id} docente`;
  }

  update(id: number, updateDocenteDto: UpdateDocenteDto) {
    return `This action updates a #${id} docente`;
  }

  remove(id: number) {
    return `This action removes a #${id} docente`;
  }

  async getDocenteWithEmail(Email:string){
    return await this.docenteModel.findOne({
      where:{ Email }
      //TODO: falta verificar si el usuario no esta eliminado o desactivado
    })
  }

  async getDocenteWithDocument(Documento:number){
    return await this.docenteModel.findOne({
      where:{ Documento }
      //TODO: falta verificar si el usuario no esta eliminado o desactivado
    })
  }

  async addFakeData(){

    for (let index = 1; index <= 100; index++) {
      const docente = await this.docenteModel.save({
        Nombres:faker.name.fullName(),
        ApellidoMaterno: faker.name.firstName(),
        ApellidoPaterno: faker.name.lastName(),
        Email: faker.internet.email(),
        Celular: 964145204,
        Direccion: faker.address.direction(),
        Documento: index,
        TipoDocumento:'DNI'
      })
  
      this.docenteModel.save(docente);
      
    }
    return {msg:`Docentes registrados correctamente`, ok:true, data:'docente' };

  }

}
