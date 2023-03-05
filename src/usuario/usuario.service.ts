import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUserDto } from './dto/update-usuario.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Usuario } from './entities/usuario.entity';
import { hashPassword } from 'src/helpers/hashPassword';
import { faker } from '@faker-js/faker';
import { ReniecUsuarioDto } from './dto/usuario-reniec.dto';
import axios from 'axios';
import { Person } from 'src/interfaces/Person';
import { EnableUserDto } from './dto/enable-usuario.dto';

@Injectable()
export class UsuarioService {

  constructor(@InjectRepository(Usuario) 
              private userModel:Repository<Usuario>){}

  async create(createUserDto: CreateUsuarioDto) {
    
    //hash password
    const password = String(createUserDto.DNI);
    createUserDto.Password = hashPassword(password);
    const usuario = await this.userModel.save(createUserDto);
    return {msg:`Usuario ${usuario.Nombres} registrados correctamente`, ok:true, data:usuario };

  }

  async findAll({limit, offset}:PaginationQueryDto) {

    const count = await this.userModel.countBy({ Estado:true });
    const data = await this.userModel.find({ 
                                            where:{ Estado:true }, 
                                            skip:offset, take:limit,
                                            order: {
                                              createdAt:'DESC'
                                            },relations:['rol']
                                            });
    return { data, count, ok:true, msg:'Lista de usuarios'};

  }

  async findOne(Id: number) {

    const data = await this.userModel.findOne({
      where:{ Id },
      relations:['rol']
    });
    
    return { data, ok:true, msg:'Usuario consultado correctamente'};

  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    try {

      const { affected } = await this.userModel.update(id, updateUserDto);
  
      if(affected==0){
        return { data:'', ok:false, msg:'Usuario sin afectar'};
      }
  
      return { data:'', ok:true, msg:'Usuario actualizado correctamente'};
      
    } catch (error) {
      
      return { data:'', ok:false, msg:error.sqlMessage};
      
    }
    
    
  }

  async remove(Id: number) {

    const { affected } = await this.userModel.update(Id,{ Estado:false });

    if(affected==0){
      return { data:'', ok:false, msg:'Usuario sin afectar'};
    }

    return { data:'', ok:true, msg:'Usuario eliminado correctamente'};
  }

  async enable(Id: number, enableUserDto:EnableUserDto) {

    const { affected } = await this.userModel.update(Id, enableUserDto);
    let msg = '';

    if(affected==0) return { data:'null', ok:false, msg:'Usuario sin afectar'};

    if(enableUserDto.Habilitado){
      msg ='Usuario inhabilitado correctamente'
    }else{
      msg ='Usuario habilitado correctamente'
    }
    
    return { data:'null', ok:true, msg};
  }

  async findOneByEmail(Email:string){

    return await this.userModel.findOne({
      where:{ Email },
      relations:['rol']
    });
    
  }

  async findOneByDNI(DNI:number){

    return await this.userModel.findOne({
      where:{ DNI },
      relations:['rol']
    });
    
  }

  async updateAccessDateUser(Id:number){

    const FechaAcceso = new Date();

    return await this.userModel.update(Id,{ FechaAcceso });
    
  }

  async queryReniec(dniDto: ReniecUsuarioDto){

    const urlBase = process.env.URL_SUNAT;

    try {

      const response = await axios.post(`${urlBase}${dniDto.DNI}`);

      if(response.data.error){
          return { msg:response.data.error, ok:false, data:null };
      }

      const data = new Person(dniDto.DNI as string, 
                              response.data.nombreSoli, 
                              response.data.apePatSoli, 
                              response.data.apeMatSoli);

      return {msg:`Datos encontrados para el DNI ${dniDto.DNI}`, ok:true, data };

    } catch (error) {
        return {msg:`Error al consultar datos`, error, ok:false, data:null} ;
    }

  }

/* A method that creates fake data for the user. */
  async fakeCreateDataUser(){

    console.log("Creando datos falsos...");
    
    // for (let index = 0; index < 100; index++) {
      
    //   await this.create({
    //       Email: faker.internet.email(),
    //       LastName: faker.name.lastName(),
    //       Name:faker.name.firstName(),
    //       Password: faker.internet.password() 
    //   });
      
    // }
    
    console.log("Datos falsos creados...");

    return true;
  }

}
