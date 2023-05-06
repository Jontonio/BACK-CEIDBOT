import { Injectable, InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleCurso } from 'src/class/global-handles';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso } from './entities/curso.entity';

@Injectable()
export class CursoService {

  constructor(@InjectRepository(Curso) 
              private cursoModel:Repository<Curso>){}

  async create(createCursoDto: CreateCursoDto) {
    try {
      const curso = await this.cursoModel.save(createCursoDto);
      return new HandleCurso(`Curso ${curso.NombreCurso } de nivel ${curso.nivel.Nivel } registrado correctamente`, true, curso);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_UPDATE_CURSO');
    }
  }

  async findAll({limit, offset}:PaginationQueryDto) {
    try {
      const count = await this.cursoModel.countBy({ Estado:true });
      const cursos = await this.cursoModel.find({ 
        where: { Estado:true }, 
        skip:offset, 
        take:limit, 
        order: { createdAt:'DESC' },
        relations:['nivel','libros'] 
      });
      return new HandleCurso(`Lista de cursos`, true, cursos, count);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('ERROR_FIND_ALL_CURSOS');
    }
  }

  async cursosInscripcion() {
    try {
      const count = await this.cursoModel.countBy({ Estado:true, EstadoApertura:true });
      const cursos = await this.cursoModel.find(
        { where: { Estado:true, EstadoApertura:true }, 
        order: { createdAt:'DESC' },
        relations:['nivel','libros'] 
      });
      return new HandleCurso(`Lista de cursos`, true, cursos, count);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_FIND_ALL_CURSOS_MATRICULA');
    }
  }

  async findOne(Id: number) {
    try {
      const curso = await this.cursoModel.findOne({
        where:{ Id },
        relations:['nivel','libros']
      });
      return new HandleCurso(`Curso ${curso.NombreCurso}`, true, curso);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('ERROR_FIND_ONE_CURSO');
    }
  }

  async findByName(NombreCurso: string, Nivel = '') {
    try {
      const query1:FindOptionsWhere<Curso> = { EstadoApertura:true, NombreCurso, nivel:{ Nivel } };
      const query2:FindOptionsWhere<Curso> = { EstadoApertura:true, NombreCurso };

      return await this.cursoModel.find({
        where: Nivel?query1:query2,
        relations:['nivel']
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('ERROR_FIND_ONE_CURSO_BY_NAME');
    }
  }

  async update(Id: number, updateCursoDto: UpdateCursoDto) {
    try {
      const { affected } = await this.cursoModel.update(Id, updateCursoDto);
      if(affected==0) return new HandleCurso(`curso sin afectar`, false, null);
      const { NombreCurso } = await this.cursoModel.findOneBy({Id});
      return new HandleCurso(`Curso ${NombreCurso.toUpperCase()} actualizado correctamente`, true, null);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('ERROR_UPDATE_CURSO');
    }
  }

  async remove(Id: number) {
    try {
      const { affected } = await this.cursoModel.update(Id,{ Estado:false });
      if(affected==0) return new HandleCurso(`Curso sin afectar`, false, null);
      const { NombreCurso } = await this.cursoModel.findOneBy({Id});
      return new HandleCurso(`Curso ${NombreCurso.toUpperCase()} eliminado correctamente`, true, null);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_REMOVE_CURSO');
    }
  }

  async getOneById(Id:number){
    try {
      return await this.cursoModel.findOne({
        where:{ Id }
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('ERROR_FIND_ONE_CURSO');
    }
  }

}
