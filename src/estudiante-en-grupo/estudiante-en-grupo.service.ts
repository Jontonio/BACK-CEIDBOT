import { Injectable, InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleEstudianteEnGrupo } from 'src/class/global-handles';
import { EstudianteService } from 'src/estudiante/estudiante.service';
import { GrupoService } from 'src/grupo/grupo.service';
import { MatriculaService } from 'src/matricula/matricula.service';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { EstudianteEnGrupoWithPagoDto } from './dto/create-estudiante-en-grupo-with-pago.dto';
import { UpdateEstudianteEnGrupoDto } from './dto/update-estudiante-en-grupo.dto';
import { EstudianteEnGrupo } from './entities/estudiante-en-grupo.entity';
import { PagoService } from 'src/pago/pago.service';
import { EstudianteDataDto } from './dto/estudiante-data.dto';
import { EstudianteEnGrupoWithOutPagoDto } from './dto/create-estudiante-en-grupo-without-pago.dto';

@Injectable()
export class EstudianteEnGrupoService {

  constructor(@InjectRepository(EstudianteEnGrupo) 
  private estudEnGrupoModel:Repository<EstudianteEnGrupo>,
  private grupoService:GrupoService,
  private matriculaService:MatriculaService,
  private pagoService:PagoService,
  private estudianteService:EstudianteService){}

  async create(createEstudEnGrupoDto: EstudianteEnGrupoWithOutPagoDto) {
    try {
      const { curso, NumeroEstudiantes, MaximoEstudiantes } = await this.grupoService.findOne(createEstudEnGrupoDto.grupo.Id);
      if(NumeroEstudiantes < MaximoEstudiantes){
        const estudEngrupo = await this.estudEnGrupoModel.save(createEstudEnGrupoDto);
        const { Nombres } = await this.estudianteService.findOne(createEstudEnGrupoDto.estudiante.Id);
        // update matricula
        await this.matriculaService.update(createEstudEnGrupoDto.matricula.Id, { EstadoMatricula:'matriculado' })
        // update grupo
        await this.grupoService.update(createEstudEnGrupoDto.grupo.Id,{ NumeroEstudiantes:NumeroEstudiantes+1 })
        return new HandleEstudianteEnGrupo(`Estudiante ${Nombres} asignado al grupo del curso de ${curso.NombreCurso} correctamente`, true, estudEngrupo);
      }
      return new HandleEstudianteEnGrupo(`El grupo del curso ${curso.NombreCurso} supera la cantidad de estudiantes permitidos`, false, null);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_REGISTER_ESTUDIANTE_EN_GRUPO');
    }
  }

  async registerFromMatricula(createEstudEnGrupoDto: EstudianteEnGrupoWithPagoDto) {
    try {
      // Veriifcar la cantidad de estudiantes en el grupo
      const { curso, NumeroEstudiantes, MaximoEstudiantes } = await this.grupoService.findOne(createEstudEnGrupoDto.grupo.Id);
      if(NumeroEstudiantes < MaximoEstudiantes){

        //matricular al estudiante 
        const { Id, estudiante}  = await this.matriculaService.create(createEstudEnGrupoDto.matricula);

        // add estudiante en grupo
        const newEstudianteGrupo = { estudiante:{ Id: estudiante.Id }, matricula:{ Id }, grupo:{ Id: createEstudEnGrupoDto.grupo.Id }}
        const enGrupo = await this.estudEnGrupoModel.save(newEstudianteGrupo);

        //actualizar contador de maximo de grupos
        await this.matriculaService.update(createEstudEnGrupoDto.matricula.Id, { EstadoMatricula:'matriculado' });
        await this.grupoService.update(createEstudEnGrupoDto.grupo.Id, { NumeroEstudiantes:NumeroEstudiantes + 1 });

        //registro de mensualidad
        createEstudEnGrupoDto.pagos = createEstudEnGrupoDto.pagos.map( pago => { 
          pago.estudianteEnGrupo = { Id: enGrupo.Id } as EstudianteEnGrupo;
          return pago;
        }) 
       
        await this.pagoService.autoRegistrerMensualidad(createEstudEnGrupoDto.pagos);

        return new HandleEstudianteEnGrupo(`${estudiante.Nombres.toUpperCase()} has registrado tu matricula satisfactoriamente`, true, enGrupo);
      }
        return new HandleEstudianteEnGrupo(`El grupo del curso ${curso.NombreCurso} - ${curso.nivel.Nivel} supera la cantidad de estudiantes permitidos`, false, null);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR REGISTER DE MATRICULA ESTUDIANTE EN GRUPO');
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

  async findEstudianteEnGrupo(estudianteDataDto:EstudianteDataDto){
    try {
      const { Documento, TipoDocumento } = estudianteDataDto;
      const estudiante = await this.estudianteService.findOneByDocumentoInternal(Documento, TipoDocumento);
      const data = await this.estudEnGrupoModel.find({ 
        where:{ Estado:true, estudiante:{ Documento, TipoDocumento } }, 
        relations:['estudiante',
                  'estudiante.apoderado',
                  'matricula',
                  'matricula.denomiServicio',
                  'matricula',
                  'grupo',
                  'grupo.curso',
                  'grupo.curso.nivel',
                  'pagos'] });
        const isEmpty = data.length==0?true:false;
        const msg = isEmpty?`El ${TipoDocumento} ${Documento} aún no este asignado a ningún grupo del CEID`
                                  :`Hola 👋 ${estudiante.Nombres} ${estudiante.ApellidoPaterno} se encuentra en la sesión de sus cursos`;
      return new HandleEstudianteEnGrupo(msg, !isEmpty, data);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_GET_ESTUDIANTES_EN_GRUPO');
    }
  }

  async findByIdGrupo(Id: number, {limit, offset}:PaginationQueryDto) {
    try {
      const count = await this.estudEnGrupoModel.count({
        where:{ Estado:true, grupo:{ Id } }, 
        relations:['matricula','matricula.denomiServicio','grupo','grupo.curso', 'estudiante','estudiante.apoderado' ] });
      const data = await this.estudEnGrupoModel.find({ 
        where:{ Estado:true, grupo:{ Id } }, 
        skip:offset, take:limit,
        relations:['matricula',
                   'matricula.denomiServicio',
                   'grupo',
                   'grupo.tipoGrupo',
                   'grupo.docente',
                   'grupo.curso',
                   'grupo.curso.nivel', 
                   'estudiante',
                   'estudiante.apoderado',
                   'pagos',
                   'pagos.categoriaPago'] });
      return new HandleEstudianteEnGrupo('Lista estudiantes asignados al grupo', true, data, count);
    } catch (e) {
      console.log(e)
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
