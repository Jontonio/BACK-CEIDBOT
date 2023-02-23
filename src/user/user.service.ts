import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { User } from './entities/user.entity';
import { hashPassword } from 'src/helpers/hashPassword';
import { faker } from '@faker-js/faker';
import { ReniecUserDto } from './dto/user-reniec.dto';
import axios from 'axios';
import { Person } from 'src/interfaces/Person';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) 
              private userModel:Repository<User>){}

  async create(createUserDto: CreateUserDto) {
    //hash password
    const password = createUserDto.Password;
    createUserDto.Password = hashPassword(password);
    return await this.userModel.save(createUserDto);
  }

  async findAll({limit, offset}:PaginationQueryDto) {
    const count = await this.userModel.countBy({IsActive:true});
    const users = await this.userModel.find({where:{IsActive:true}, skip:offset, take:limit});
    const data = {users, count }
    return data;
  }

  async findOne(Id: number) {
    return await this.userModel.findOneBy({Id});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userModel.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userModel.update(id,{IsActive:false});
  }

  async findOneByEmail(Email:string){
    return await this.userModel.findOne({
      where:{ Email },
      relations:['role']
    });
  }

  async queryReniec(dniDto: ReniecUserDto){

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
