import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MatriculaService } from './matricula.service';
import { MatriculaController } from './matricula.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matricula } from './entities/matricula.entity';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';
import { Apoderado } from 'src/apoderado/entities/apoderado.entity';
import { Estudiante } from 'src/estudiante/entities/estudiante.entity';
import { ApoderadoService } from 'src/apoderado/apoderado.service';
import { EstudianteService } from 'src/estudiante/estudiante.service';
import { Institucion } from 'src/institucion/entities/institucion.entity';
import { InstitucionService } from 'src/institucion/institucion.service';
import { GrupoService } from 'src/grupo/grupo.service';
import { Grupo } from 'src/grupo/entities/grupo.entity';
import { TipoGrupo } from 'src/grupo/entities/tipo-grupo.entity';
import { EstudianteEnGrupoService } from 'src/estudiante-en-grupo/estudiante-en-grupo.service';
import { EstudianteEnGrupo } from 'src/estudiante-en-grupo/entities/estudiante-en-grupo.entity';
import { MensualidadService } from 'src/mensualidad/mensualidad.service';
import { Mensualidad } from 'src/mensualidad/entities/mensualidad.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Matricula, 
                                     Apoderado, 
                                     Estudiante, 
                                     Grupo,
                                     TipoGrupo,
                                     Mensualidad,
                                     EstudianteEnGrupo,
                                     Institucion])],
  controllers: [MatriculaController],
  providers: [MatriculaService,
              ApoderadoService, 
              GrupoService,
              EstudianteEnGrupoService,
              MensualidadService,
              EstudianteService,
              InstitucionService]
})
export class MatriculaModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude({ path:'matricula/matricular-estudiante', method:RequestMethod.POST},
               { path:'matricula/file-matricula', method:RequestMethod.POST })
      .forRoutes(MatriculaController)
  }

}
