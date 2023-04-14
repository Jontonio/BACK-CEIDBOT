import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { PasswordUsuarioDto } from './dto/password-usuario.dto';
import { UpdateUserDto } from './dto/update-usuario.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Usuario } from './entities/usuario.entity';
import { comparePassword, hashPassword } from 'src/helpers/hashPassword';
import { ReniecUsuarioDto } from './dto/usuario-reniec.dto';
import { Person } from 'src/interfaces/Person';
import { EnableUserDto } from './dto/enable-usuario.dto';
import axios from 'axios';

import { faker } from '@faker-js/faker';
import { HandleUsuario } from 'src/class/global-handles';

@Injectable()
export class UsuarioService {

  constructor(@InjectRepository(Usuario) 
              private userModel:Repository<Usuario>){}

  async create(createUserDto: CreateUsuarioDto) {
    try {
      /** hash password */
      const password = String(createUserDto.DNI);
      createUserDto.Password = hashPassword(password);
      const usuario = await this.userModel.save(createUserDto);
      return new HandleUsuario(`Usuario ${usuario.Nombres} registrado correctamente`, true, usuario);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('ERROR_CREATE_USUARIO');
    }
  }

  async findAll({limit, offset}:PaginationQueryDto) {

    try {
      const count = await this.userModel.countBy({ Estado:true });
      const usuarios = await this.userModel.find({
        where:{ Estado:true }, 
        skip:offset, take:limit,
        order: { createdAt:'DESC' },
        relations:['rol']
        });
      return new HandleUsuario(`Lista de usuarios`, true, usuarios, count);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('ERROR_GET_USUARIOS');
    }
  }

  async findOne(Id: number) {
    try {
      const usuario = await this.userModel.findOne({
        where:{ Id },
        relations:['rol']
      });
      return new HandleUsuario(`Usuario con Id ${Id} consultado correctamente`, true, usuario);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('ERROR_FIND_ONE_USUARIO');
    }
  }

  async update(Id: number, updateUserDto: UpdateUserDto) {
    try {
      const { affected } = await this.userModel.update(Id, updateUserDto);
      if(affected==0) return new HandleUsuario(`Usuario sin afectar`, false, null);
      const { Nombres } = await this.userModel.findOneBy({Id});
      return new HandleUsuario(`Usuario ${Nombres} actualizado correctamente`, true, null);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('ERROR_UPDATE_USUARIO');
    }
  }

  async remove(Id: number) {
    try {
      const { affected } = await this.userModel.update(Id,{ Estado:false });
      if(affected==0) return new HandleUsuario(`Usuario sin afectar`, false, null);
      const { Nombres } = await this.userModel.findOneBy({Id});
      return new HandleUsuario(`Usuario ${Nombres} eliminado correctamente`, true, null);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_REMOVE_USUARIO');
    }
  }

  async enable(Id: number, enableUserDto:EnableUserDto) {
    try {
      const { affected } = await this.userModel.update(Id, enableUserDto);
      let msg = '';
      if(affected==0) return { data:'null', ok:false, msg:'Usuario sin afectar'};
      const { Nombres } = await this.userModel.findOneBy({Id});
      msg = enableUserDto.Habilitado?`Usuario ${Nombres} habilitado correctamente`:`Usuario ${Nombres} inhabilitado correctamente`;
      return new HandleUsuario(msg, true, null);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_ENABLE_USUARIO');
    }
  }

  async findOneByEmail(Email:string){
    try {
      return await this.userModel.findOne({
        where:{ Email },
        relations:['rol']
      });
    } catch (e) {
      throw new InternalServerErrorException('ERROR_FIND_BY_EMAIL_USUARIO');
    }
    
  }

  async findOneByDNI(DNI:string){
    try {
      return await this.userModel.findOne({
        where:{ DNI },
        relations:['rol']
      });
    } catch (e) {
      throw new InternalServerErrorException('ERROR_FIND_BY_DNI_USUARIO');
    }
  }
  async findOneByID(Id: number) {
    try {
      return await this.userModel.findOne({
        where:{ Id },
        relations:['rol']
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('ERROR_FIND_ONE_USUARIO');
    }
  }

  async updateAccessDateUser(Id:number){
    try {
      const FechaAcceso = new Date();
      return await this.userModel.update(Id,{ FechaAcceso });
    } catch (error) {
      throw new InternalServerErrorException('ERROR_UPDATE_ACCESS_DATE_USUARIO');
    }
  }

  async queryReniec(dniDto: ReniecUsuarioDto){
    const urlBase = process.env.URL_SUNAT;
    try {
      const response = await axios.post(`${urlBase}${dniDto.DNI}`);
      if(response.data.error){
          return new HandleUsuario(response.data.error, false, null);
      }
      const data = new Person(dniDto.DNI as string, 
                              response.data.nombreSoli, 
                              response.data.apePatSoli, 
                              response.data.apeMatSoli);
      return new HandleUsuario(`Datos encontrados para el DNI ${dniDto.DNI}`, true, data);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_QUERY_RENIEC');
    }
  }

  async updatePassword(Id :number, passUsuarioDto:PasswordUsuarioDto){
    try {

      const { CurrentPassword, NewPassword, RepeatPassword } = passUsuarioDto;
      const usuario  = await this.userModel.findOneBy({Id});

      if(!comparePassword(CurrentPassword, usuario.Password)){
        return new HandleUsuario(`Digite bien su contraseña actual`, false, null);
      }
      if(NewPassword!==RepeatPassword){
        return new HandleUsuario(`Las contraseñas nuevas no son iguales`, false, null);
      }

      const Password = hashPassword(NewPassword);
      const { affected } = await this.userModel.update(Id, { Password });

      if(affected==0) return new HandleUsuario(`Actualización de password sin afectar`, false, null);
      return new HandleUsuario(`Contraseña actualizada correctamente`, true, null);

    } catch (e) {
      throw new InternalServerErrorException('ERROR_UPDATE_PASSWORD');
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
