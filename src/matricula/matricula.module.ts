import { Module, MiddlewareConsumer } from '@nestjs/common';
import { MatriculaService } from './matricula.service';
import { MatriculaController } from './matricula.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matricula } from './entities/matricula.entity';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';
import { Apoderado } from 'src/apoderado/entities/apoderado.entity';
import { Estudiante } from 'src/estudiante/entities/estudiante.entity';
import { DenominacionServicio } from 'src/denominacion-servicio/entities/denominacion-servicio.entity';
import { Curso } from 'src/curso/entities/curso.entity';
import { ApoderadoService } from 'src/apoderado/apoderado.service';
import { EstudianteService } from 'src/estudiante/estudiante.service';
import { CursoService } from 'src/curso/curso.service';
import { DenominacionServicioService } from 'src/denominacion-servicio/denominacion-servicio.service';
import { Institucion } from 'src/institucion/entities/institucion.entity';
import { InstitucionService } from 'src/institucion/institucion.service';

@Module({
  imports:[TypeOrmModule.forFeature([Matricula, 
                                     Apoderado, 
                                     Estudiante, 
                                     DenominacionServicio, 
                                     Curso,
                                     Institucion])],
  controllers: [MatriculaController],
  providers: [MatriculaService,
              ApoderadoService, 
              EstudianteService,
              DenominacionServicioService,
              CursoService, 
              InstitucionService]
})
export class MatriculaModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware).forRoutes(MatriculaController)
  }

}
