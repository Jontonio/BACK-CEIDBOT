import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteController } from './estudiante.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';

@Module({
  imports:[TypeOrmModule.forFeature([Estudiante])],
  controllers: [EstudianteController],
  providers: [EstudianteService]
})
export class EstudianteModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware).
      exclude({ path:'estudiante/verify-documento-email', method:RequestMethod.POST },
              { path:'estudiante/get-estudiante-by-documento', method:RequestMethod.POST })
      .forRoutes(EstudianteController)
  }

}
