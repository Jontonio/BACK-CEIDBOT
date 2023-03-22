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

@Module({
  imports:[TypeOrmModule.forFeature([Matricula, 
                                     Apoderado, 
                                     Estudiante, 
                                     Institucion])],
  controllers: [MatriculaController],
  providers: [MatriculaService,
              ApoderadoService, 
              EstudianteService,
              InstitucionService]
})
export class MatriculaModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude({ path:'matricula/matricular-estudiante', method:RequestMethod.POST})
      .forRoutes(MatriculaController)
  }

}
