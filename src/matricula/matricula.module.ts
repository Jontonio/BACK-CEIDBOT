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
import { PagoService } from 'src/pago/pago.service';
import { Pago } from '../pago/entities/pago.entity';
import { GrupoModulo } from 'src/grupo/entities/grupoModulo.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Matricula, 
                                     Apoderado, 
                                     Estudiante, 
                                     Grupo,
                                     TipoGrupo,
                                     GrupoModulo,
                                     Pago,
                                     EstudianteEnGrupo,
                                     Institucion])],
  controllers: [MatriculaController],
  providers: [MatriculaService,
              ApoderadoService, 
              GrupoService,
              EstudianteEnGrupoService,
              PagoService,
              EstudianteService,
              InstitucionService]
})
export class MatriculaModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude({ path:'matricula/prematricula-estudiante', method:RequestMethod.POST},
               { path:'matricula/upload-file', method:RequestMethod.POST })
      .forRoutes(MatriculaController)
  }

}
