import { Module } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CursoController } from './curso.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';
// import { AppGateway } from 'src/socket/socket.gateway';

@Module({
  imports:[TypeOrmModule.forFeature([Curso])],
  controllers: [CursoController],
  providers: [CursoService]
})
export class CursoModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware).forRoutes(CursoController)
      // .forRoutes({ path:'teacher/add-teacher', method: RequestMethod.POST})
  }

}
