import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/user/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {

  constructor(@InjectRepository(Course) 
              private courseModel:Repository<Course>){}

  async create(createCourseDto: CreateCourseDto) {
    const curso = await this.courseModel.save(createCourseDto);
    return {msg:`Curso ${curso.NombreCurso } de nivel ${curso.NivelCurso} registrado correctamente`, ok:true, data:curso };
  }

  async findAll({limit, offset}:PaginationQueryDto) {

    const count = await this.courseModel.countBy({ Estado:true });
    const courses = await this.courseModel.find(
      { 
        where: {
                 Estado:true
               }, 
      skip:offset, 
      take:limit, 
      order: {
        createdAt:'DESC'
      } 
    });

    return {data:courses, count, ok:true, msg:'Get all courses from DB'}
  }

  findOne(id: number) {
    return `This action returns a #${id} curso`;
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} curso`;
  }

  remove(id: number) {
    return `This action removes a #${id} curso`;
  }
}
