import { Module, RequestMethod} from '@nestjs/common';
import { CursoService } from './curso.service';
import { CursoController } from './curso.controller';
import { Modulo } from './entities/modulo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token.middleware';
import { VerifyIdCursoMiddleware } from 'src/middlewares/verify-id-curso.middleware';
import { VerifyCursoMiddleware } from 'src/middlewares/verify-curso.middleware';

@Module({
  imports:[TypeOrmModule.forFeature([Curso, Modulo])],
  controllers: [CursoController],
  providers: [CursoService]
})
export class CursoModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude({ path:'curso/get-cursos-inscripcion', method:RequestMethod.GET })
      .forRoutes(CursoController)
      .apply(VerifyIdCursoMiddleware)
      .forRoutes({ path:'curso/delete-curso/:id', method: RequestMethod.DELETE },
                 { path:'curso/update-curso/:id', method: RequestMethod.PATCH  },
                 { path:'curso/get-one-curso/:id', method: RequestMethod.GET   })
      .apply(VerifyCursoMiddleware)
      .forRoutes({ path:'curso/add-curso', method:RequestMethod.POST })
  }

}
