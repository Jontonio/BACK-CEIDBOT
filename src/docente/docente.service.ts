import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import { Docente } from './entities/docente.entity';
import { faker } from '@faker-js/faker';
import { HandleDocente } from 'src/class/global-handles';

@Injectable()
export class DocenteService {

  constructor(@InjectRepository(Docente) 
               private docenteModel:Repository<Docente>){}

  async create(createDocenteDto: CreateDocenteDto) {
    try {
      const docente = await this.docenteModel.save(createDocenteDto);
      return new HandleDocente(`Docente ${docente.Nombres} registrado correctamente`, true, docente);
    } catch (error) {
      throw new InternalServerErrorException('ERROR_CREATE_DOCENTE');
    }
  }

  async findAll({limit, offset}:PaginationQueryDto) {
    try {
      const count = await this.docenteModel.countBy({Estado:true});
      const docentes = await this.docenteModel.find(
        { where:{ Estado:true }, 
          skip:offset, 
          take:limit, 
          order: { createdAt:'DESC' } 
        });
      return new HandleDocente('Lista de docentes', true, docentes, count);
    } catch (error) {
      throw new InternalServerErrorException('ERROR_GET_DOCENTES');
    }
  }

  async findOne(Id: number) {
    try {
      const docente = await this.docenteModel.findOneBy({ Id, Estado:true });
      return new HandleDocente(`Docente con ${docente.Id} encontrado`, true, docente);
    } catch (error) {
      throw new InternalServerErrorException('ERROR_GET_DOCENTE');
    }
  }

  async update(Id: number, updateDocenteDto: UpdateDocenteDto) {
    try {
      const { affected } = await this.docenteModel.update(Id, updateDocenteDto);
      if(affected==0) return new HandleDocente(`Docente sin afectar`, false, null);
      const usuario = await this.docenteModel.findOneBy({Id});
      return new HandleDocente(`Docente ${usuario.Nombres} actualizado correctamente`, true, null);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('ERROR_UPDATE_DOCENTE');
    }
  }

  async remove(Id: number) {
    try {
      const { affected } = await this.docenteModel.update(Id,{ Estado:false });
      if(affected==0) return new HandleDocente(`Docente sin afectar`, false, null);
      const usuario = await this.docenteModel.findOneBy({Id});
      return new HandleDocente(`Docente ${usuario.Nombres} eliminado correctamente`, true, usuario);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('ERROR_DELETE_DOCENTE');
    }
  }

  async getDocenteWithEmail(Email:string){
    //TODO: falta verificar si el usuario no esta eliminado o desactivado
    try {
      return await this.docenteModel.findOne({
        where:{ Email }
      })
    } catch (error) {
      throw new InternalServerErrorException('ERROR_GET_DOCENTE_BY_EMAIL');
    }
  }

  async getDocenteWithDocument(Documento:string){
    //TODO: falta verificar si el usuario no esta eliminado o desactivado
    try {
      return await this.docenteModel.findOne({
        where:{ Documento }
      })
    } catch (error) {
      throw new InternalServerErrorException('ERROR_GET_DOCENTE_BY_DOCUMENT');
    }
  }

  async getOneById(Id:number){
    try {
      return await this.docenteModel.findOne({
        where:{ Id }
      })
    } catch (error) {
      throw new InternalServerErrorException('ERROR_GET_DOCENTE_BY_ID');
    }
  }

  async addFakeData(){

    // for (let index = 1; index <= 100; index++) {
    //   const docente = await this.docenteModel.save({
    //     Nombres:faker.name.fullName(),
    //     ApellidoMaterno: faker.name.firstName(),
    //     ApellidoPaterno: faker.name.lastName(),
    //     Email: faker.internet.email(),
    //     Celular: 964145204,
    //     Direccion: faker.address.direction(),
    //     Documento: index,
    //     TipoDocumento:'DNI'
    //   })
  
    //   this.docenteModel.save(docente);
      
    // }
    // return {msg:`Docentes registrados correctamente`, ok:true, data:'docente' };

  }

}
