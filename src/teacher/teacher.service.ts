import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/user/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class TeacherService {

  constructor(@InjectRepository(Teacher) 
               private teacherModel:Repository<Teacher>){}

  async create(createTeacherDto: CreateTeacherDto) {
    const teacher = await this.teacherModel.save(createTeacherDto)
    return {msg:`Docente ${teacher.Nombres} registrados correctamente`, ok:true, data:teacher };
  }

  async findAll({limit, offset}:PaginationQueryDto) {
    const count = await this.teacherModel.countBy({Estado:true});
    const teachers = await this.teacherModel.find(
                                { where:{Estado:true}, 
                                  skip:offset, 
                                  take:limit, 
                                  order: {
                                    createdAt:'DESC'
                                  } 
                                });
    return {data:teachers, count, ok:true, msg:'Get all docentes from DB'};
  }

  findOne(id: number) {
    return `This action returns a #${id} teacher`;
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return `This action updates a #${id} teacher`;
  }

  remove(id: number) {
    return `This action removes a #${id} teacher`;
  }

  async getTeacherWithEmail(Email:string){
    return await this.teacherModel.findOne({
      where:{ Email }
      //TODO: falta verificar si el usuario no esta eliminado o desactivado
    })
  }

  async getTeacherWithDocument(Documento:number){
    return await this.teacherModel.findOne({
      where:{ Documento }
      //TODO: falta verificar si el usuario no esta eliminado o desactivado
    })
  }

  async addFakeData(){

    for (let index = 1; index <= 100; index++) {
      const teacher = await this.teacherModel.save({
        Nombres:faker.name.fullName(),
        ApellidoMaterno: faker.name.firstName(),
        ApellidoPaterno: faker.name.lastName(),
        Email: faker.internet.email(),
        Celular: 964145204,
        Direccion: faker.address.direction(),
        Documento: index,
        TipoDocumento:'DNI'
      })
  
      this.teacherModel.save(teacher);
      
    }
    return {msg:`Docentes registrados correctamente`, ok:true, data:'teacher' };

  }

}
