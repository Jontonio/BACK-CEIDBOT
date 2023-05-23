import { Injectable, InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleCurso, HandleModulo } from 'src/class/global-handles';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso } from './entities/curso.entity';
import { Modulo } from './entities/modulo.entity';
import { CreateModuloDto } from './dto/create-modulo.dto';

@Injectable()
export class CursoService {

  constructor(@InjectRepository(Curso) 
              private cursoModel:Repository<Curso>,
              @InjectRepository(Modulo) 
              private moduloModel:Repository<Modulo>){}

  async createCurso(createCursoDto: CreateCursoDto) {
    try {
      const curso = await this.cursoModel.save(createCursoDto);
      return new HandleCurso(`Curso ${curso.NombreCurso } de nivel ${curso.nivel.Nivel } registrado correctamente`, true, curso);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  
  async createModulo(createModuloDto: CreateModuloDto) {
    try {
      const modulo = await this.moduloModel.findOneBy({ Modulo: createModuloDto.Modulo });
      if(modulo){
        return new HandleModulo(`El módulo ${createModuloDto.Modulo } ya se encuentra registrado`, false, null);
      }
      const resModulo = await this.moduloModel.save(createModuloDto);
      return new HandleModulo(`Módulo ${resModulo.Modulo } registrado correctamente`, true, resModulo);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException(e.message);
    }
  }

  async findAllCursos({limit, offset}:PaginationQueryDto) {
    try {
      const count = await this.cursoModel.countBy({ Estado:true });
      const cursos = await this.cursoModel.find({ 
        where: { Estado:true }, 
        skip:offset, 
        take:limit, 
        order: { createdAt:'DESC' },
        relations:['nivel','libros','modulo'] 
      });
      return new HandleCurso(`Lista de cursos`, true, cursos, count);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.message);
    }
  }

  async findAllModulos({limit, offset}:PaginationQueryDto) {
    try {
      const count = await this.moduloModel.count();
      const modulos = await this.moduloModel.find({ 
        skip:offset, 
        take:limit, 
        order: { Modulo:'ASC' }
      });
      return new HandleModulo(`Lista de modulos`, true, modulos, count);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.message);
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
      throw new InternalServerErrorException(e.message);
    }
  }

  async findOne(Id: number) {
    try {
      const curso = await this.cursoModel.findOne({
        where:{ Id },
        relations:['nivel','libros','modulo']
      });
      return new HandleCurso(`Curso ${curso.NombreCurso}`, true, curso);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.message);
    }
  }

  async findByName(NombreCurso: string, Nivel = '') {
    try {
      const query1:FindOptionsWhere<Curso> = { EstadoApertura:true, NombreCurso, nivel:{ Nivel } };
      const query2:FindOptionsWhere<Curso> = { EstadoApertura:true, NombreCurso };

      return await this.cursoModel.find({
        where: Nivel?query1:query2,
        relations:['nivel','modulo']
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.message);
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
