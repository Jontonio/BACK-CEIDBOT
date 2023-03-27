import { Injectable, InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleEstudianteEnGrupo } from 'src/class/global-handles';
import { EstudianteService } from 'src/estudiante/estudiante.service';
import { GrupoService } from 'src/grupo/grupo.service';
import { MatriculaService } from 'src/matricula/matricula.service';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateEstudianteEnGrupoDto } from './dto/create-estudiante-en-grupo.dto';
import { UpdateEstudianteEnGrupoDto } from './dto/update-estudiante-en-grupo.dto';
import { EstudianteEnGrupo } from './entities/estudiante-en-grupo.entity';

@Injectable()
export class EstudianteEnGrupoService {

  constructor(@InjectRepository(EstudianteEnGrupo) 
  private estudEnGrupoModel:Repository<EstudianteEnGrupo>,
  private grupoService:GrupoService,
  private matriculaService:MatriculaService,
  private estudianteService:EstudianteService){}

  async create(createEstudEnGrupoDto: CreateEstudianteEnGrupoDto) {
    try {
      const { curso, NumeroEstudiantes, MaximoEstudiantes } = await this.grupoService.findOne(createEstudEnGrupoDto.grupo.Id);
      if(NumeroEstudiantes < MaximoEstudiantes){
        const estudEngrupo = await this.estudEnGrupoModel.save(createEstudEnGrupoDto);
        const { Nombres } = await this.estudianteService.findOne(createEstudEnGrupoDto.estudiante.Id);
        // update matricula
        await this.matriculaService.update(createEstudEnGrupoDto.matricula.Id, {EstadoMatricula:'asignado'})
        // update grupo
        await this.grupoService.update(createEstudEnGrupoDto.grupo.Id,{NumeroEstudiantes:NumeroEstudiantes+1})
        return new HandleEstudianteEnGrupo(`Estudiante ${Nombres} asignado al grupo del curso de ${curso.NombreCurso} - ${curso.NivelCurso} correctamente`, true, estudEngrupo);
      }
      return new HandleEstudianteEnGrupo(`El grupo ${curso.NombreCurso} - ${curso.NivelCurso} se encuentra llena`, false, null);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_CREATE_ESTUDIANTE_EN_GRUPO');
    }
  }

  async findAll({limit, offset}:PaginationQueryDto) {
    try {
      const count = await this.estudEnGrupoModel.countBy({ Estado:true });
      const data = await this.estudEnGrupoModel.find({ 
        where:{ Estado:true }, 
        skip:offset, take:limit,
        order: { createdAt:'DESC' },
        relations:['matricula','matricula.denomiServicio','matricula.curso','grupo', 'estudiante','estudiante.apoderado' ] });
      return new HandleEstudianteEnGrupo('Lista estudiantes asignados al grupo', true, data, count);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_GET_ESTUDIANTES_EN_GRUPO');
    }
  }

  async findByIdGrupo(Id: number, {limit, offset}:PaginationQueryDto) {
    try {
      const count = await this.estudEnGrupoModel.count({
        where:{ Estado:true, grupo:{ Id } }, 
        relations:['matricula','matricula.denomiServicio','matricula.curso','grupo', 'estudiante','estudiante.apoderado' ] });
      const data = await this.estudEnGrupoModel.find({ 
        where:{ Estado:true, grupo:{ Id } }, 
        skip:offset, take:limit,
        relations:['matricula','matricula.denomiServicio','grupo', 'estudiante','estudiante.apoderado' ] });
      return new HandleEstudianteEnGrupo('Lista estudiantes asignados al grupo', true, data, count);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_GET_ESTUDIANTES_EN_GRUPO_ESPECIFICO');
    }
  }

  update(id: number, updateEstudianteEnGrupoDto: UpdateEstudianteEnGrupoDto) {
    return `This action updates a #${id} estudianteEnGrupo`;
  }

  remove(id: number) {
    return `This action removes a #${id} estudianteEnGrupo`;
  }
}
