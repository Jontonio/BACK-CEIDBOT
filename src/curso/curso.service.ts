import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso } from './entities/curso.entity';

@Injectable()
export class CursoService {

  constructor(@InjectRepository(Curso) 
              private cursoModel:Repository<Curso>){}

  async create(createCursoDto: CreateCursoDto) {
    const curso = await this.cursoModel.save(createCursoDto);
    return {msg:`Curso ${curso.NombreCurso } de nivel ${curso.NivelCurso} registrado correctamente`, ok:true, data:curso };
  }

  async findAll({limit, offset}:PaginationQueryDto) {

    const count = await this.cursoModel.countBy({ Estado:true });
    const cursos = await this.cursoModel.find(
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

    return {data:cursos, count, ok:true, msg:'Get all cursos from DB'}
  }

  findOne(id: number) {
    return `This action returns a #${id} curso`;
  }

  update(id: number, updateCursoDto: UpdateCursoDto) {
    return `This action updates a #${id} curso`;
  }

  remove(id: number) {
    return `This action removes a #${id} curso`;
  }
}
