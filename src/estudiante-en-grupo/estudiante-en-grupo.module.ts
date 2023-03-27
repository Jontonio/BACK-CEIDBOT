import { Module } from '@nestjs/common';
import { EstudianteEnGrupoService } from './estudiante-en-grupo.service';
import { EstudianteEnGrupoController } from './estudiante-en-grupo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEnGrupo } from './entities/estudiante-en-grupo.entity';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';
import { Grupo } from 'src/grupo/entities/grupo.entity';
import { Estudiante } from 'src/estudiante/entities/estudiante.entity';
import { EstudianteService } from 'src/estudiante/estudiante.service';
import { GrupoService } from 'src/grupo/grupo.service';
import { TipoGrupo } from 'src/grupo/entities/tipo-grupo.entity';
import { Matricula } from 'src/matricula/entities/matricula.entity';
import { MatriculaService } from 'src/matricula/matricula.service';
import { Apoderado } from 'src/apoderado/entities/apoderado.entity';
import { Institucion } from 'src/institucion/entities/institucion.entity';
import { ApoderadoService } from 'src/apoderado/apoderado.service';
import { InstitucionService } from 'src/institucion/institucion.service';

@Module({
  imports:[TypeOrmModule.forFeature([EstudianteEnGrupo, 
                                     Grupo, 
                                     Estudiante, 
                                     TipoGrupo, 
                                     Matricula, 
                                     Apoderado, 
                                     Institucion, 
                                     Estudiante])],
  controllers: [EstudianteEnGrupoController],
  providers: [EstudianteEnGrupoService, 
              EstudianteService, 
              GrupoService, 
              MatriculaService, 
              ApoderadoService,
              InstitucionService]
})
export class EstudianteEnGrupoModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware).forRoutes(EstudianteEnGrupoController)
  }

}
