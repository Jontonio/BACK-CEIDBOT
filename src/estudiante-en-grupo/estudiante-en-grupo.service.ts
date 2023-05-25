import { Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleEstudianteEnGrupo, HandleEstudianteEnGrupoPago } from 'src/class/global-handles';
import { EstudianteService } from 'src/estudiante/estudiante.service';
import { GrupoService } from 'src/grupo/grupo.service';
import { MatriculaService } from 'src/matricula/matricula.service';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { EstudianteEnGrupoWithPagoDto } from './dto/create-estudiante-en-grupo-with-pago.dto';
import { EstudianteEnGrupo } from './entities/estudiante-en-grupo.entity';
import { PagoService } from 'src/pago/pago.service';
import { EstudianteDataDto } from './dto/estudiante-data.dto';
import { EstudianteEnGrupoWithOutPagoDto } from './dto/create-estudiante-en-grupo-without-pago.dto';
import * as moment from 'moment';
import { Pago } from 'src/pago/entities/pago.entity';
import { GrupoModulo } from 'src/grupo/entities/grupoModulo.entity';
import { UpdateGrupoDto } from 'src/grupo/dto/update-grupo.dto';

moment.locale('es');

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
        await this.grupoService.updateGrupo(createEstudEnGrupoDto.grupo.Id,{ NumeroEstudiantes:NumeroEstudiantes+1 })
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
      const resEstudiante = await this.estudEnGrupoModel.findOneBy({ 
        estudiante:{ Documento: createEstudEnGrupoDto.estudiante.Documento },
        grupo:{ Id: createEstudEnGrupoDto.grupo.Id }
      }); 
      console.log(createEstudEnGrupoDto)
      if(resEstudiante){
        return new HandleEstudianteEnGrupo(`El estudiante ya se encuentra registrado en el grupo. Elija un curso con un grupo diferente`, false, null);
      }
      if(NumeroEstudiantes < MaximoEstudiantes){
        
        //matricular al estudiante 
        const { Id, estudiante}  = await this.matriculaService.create(createEstudEnGrupoDto.matricula);

        // add estudiante en grupo
        const newEstudianteGrupo = { estudiante:{ Id: estudiante.Id }, matricula:{ Id }, grupo:{ Id: createEstudEnGrupoDto.grupo.Id }}
        const enGrupo = await this.estudEnGrupoModel.save(newEstudianteGrupo);

        //actualizar contador de maximo de grupos
        await this.matriculaService.update(createEstudEnGrupoDto.matricula.Id, { EstadoMatricula:'matriculado' });
        await this.grupoService.updateGrupo(createEstudEnGrupoDto.grupo.Id, { NumeroEstudiantes:NumeroEstudiantes + 1 });

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
        relations:['matricula',
                   'matricula.denomiServicio',
                   'matricula.curso',
                   'grupo', 
                   'estudiante',
                   'estudiante.apoderado'] 
                  });
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
                  'matricula.denomiServicio',
                  'grupo.curso',
                  'grupo.curso.nivel',
                  'grupo.grupoModulo',
                  'grupo.grupoModulo.modulo',
                  'pagos'] });
        const isEmpty = data.length==0?true:false;
        const msg = isEmpty?`El ${TipoDocumento} ${Documento} aún no este asignado a ningún grupo del CEID`
                           :`Hola 👋 ${estudiante.Nombres} se encuentra en la sesión de sus cursos`;
      return new HandleEstudianteEnGrupo(msg, !isEmpty, data);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_GET_ESTUDIANTES_EN_GRUPO');
    }
  }

  async findEstudianteEnGrupoById(IdGrupo:number, IdEstudiante:number){
    try {
      const res = await this.estudEnGrupoModel.find({ 
        where:{ Estado:true, estudiante:{ Id:IdEstudiante }, grupo:{ Id:IdGrupo}}, 
        relations:['estudiante',
                  'estudiante.apoderado',
                  'matricula.denomiServicio',
                  'grupo.curso',
                  'grupo.curso.nivel',
                  'grupo.grupoModulo',
                  'grupo.grupoModulo.modulo',
                  'pagos',
                  'pagos.grupoModulo',
                  'pagos.grupoModulo.modulo'] });
      const result = (res.length>0)?res[0]:null;
      return new HandleEstudianteEnGrupo(`Datos encontrados para el estudiante ${IdEstudiante} y el grupo ${IdGrupo}`, true, result, 1, (result)?this.dataHistorial(result.pagos, result.grupo.grupoModulo):null);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_GET_ESTUDIANTES_EN_GRUPO');
    }
  }

  async findByIdGrupo(Id: number, {limit, offset}:PaginationQueryDto) {
    try {
      const count = await this.estudEnGrupoModel.count({
        where:{ Estado:true, grupo:{ Id } }, 
        relations:['matricula',
                   'matricula.denomiServicio',
                   'grupo',
                   'grupo.curso',
                   'estudiante',
                   'estudiante.apoderado'
                  ]});
      const grupo = await this.grupoService.findOne( Id );
      const estudiantesEnGrupo = await this.estudEnGrupoModel.find({ 
        where:{ Estado:true, grupo:{ Id } }, 
        skip:offset, take:limit,
        relations:['matricula',
                   'matricula.denomiServicio',
                   'grupo',
                   'grupo.tipoGrupo',
                   'grupo.docente',
                   'grupo.curso',
                   'grupo.curso.nivel', 
                   'grupo.curso.modulo', 
                   'estudiante',
                   'estudiante.apoderado',
                   'moras',
                   'moras.grupoModulo',
                   'moras.grupoModulo.modulo',
                   'pagos',
                   'pagos.medioDePago',
                   'pagos.grupoModulo',
                   'pagos.grupoModulo.modulo',
                   'pagos.categoriaPago']});

      const fecha1 = moment(grupo.FechaInicioGrupo); // fecha de inicio del grupo
      const fechaActual = moment().format('YYYY-MM-DD');  // fecha actual
      const fecha4 = moment(fechaActual);                 // fecha auxiliar
      const diasTrans = fecha4.diff(fecha1, 'days'); // Numero de dias pasados desde el inicio de las clases
      const diasTranscurridos = diasTrans>0?`${diasTrans} dias`:`${Math.abs(diasTrans)} dias para el inicio del grupo`;
      const infoDateGrupo = { diasTranscurridos, fechaActual };
      const data = { grupo, estudiantesEnGrupo, infoDateGrupo } 
      return new HandleEstudianteEnGrupoPago('Lista estudiantes asignados al grupo', true, data, count);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_GET_ESTUDIANTES_EN_GRUPO_ESPECIFICO');
    }
  }

  async remove(Id: number) {
    try{
      const estudentGrupo = await this.estudEnGrupoModel.update(Id, {Estado: false})
      if(!estudentGrupo){
        throw new NotFoundException(`No no se encontro al estudiante con el Id ${Id}`);
      }
      const { affected } = await this.estudEnGrupoModel.update(Id, { Estado: false })
      if(affected==0) return new HandleEstudianteEnGrupoPago(`Estudiante sin afectar`, false, null);
      const { estudiante, grupo } = await this.estudEnGrupoModel.findOne({
        where:{ Id },
        relations:['estudiante','grupo']
      });

      
      // contar la cantidad de estudiantes
      const countEstudiante = await this.estudEnGrupoModel.count({ 
        where:{ Estado: true, 
          grupo:{ Id: grupo.Id } 
        }});
        
        // actualizar la cantidad de estudiantes 
      await this.grupoService.updateGrupo(grupo.Id, { NumeroEstudiantes: countEstudiante } as UpdateGrupoDto);
      // retornar resultados
      return new HandleEstudianteEnGrupoPago(`Estudiante ${estudiante.Nombres.toUpperCase()} ${estudiante.ApellidoPaterno.toUpperCase()} fue eliminado del grupo correctamente`, true, estudiante);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR ELIMINAR ESTUDIANTE EN GRUPO');
    }
  }

  dataHistorial(pagos:Pago[] = [], grupoMdulo:GrupoModulo[] = []){
    // const data:Data[] = [];
    // const gModulo = 'Fechas de pago';
    // const gSeries:Series[] = [];
    // grupoMdulo.forEach( gModulo => {
    //   gSeries.push({value: moment(gModulo.FechaPago).valueOf(), name: `${gModulo.modulo.Modulo}`})
    // })
    // data.push({name:gModulo, series: gSeries})
    // const gPago = 'Fecha de pago realizadas';
    // const gPagos:Series[] = [];
    // pagos.forEach( (pago) => {
    //   if(pago.grupoModulo){
    //     console.log(pago)
    //     gPagos.push({value: moment(pago.FechaPago).valueOf(), name: `${pago.grupoModulo.modulo.Modulo}`})
    //   }
    // })
    // data.push({name:gPago, series:gPagos})
    return [];
  }
}
