import { Module, RequestMethod } from '@nestjs/common';
import { DocenteService } from './docente.service';
import { DocenteController } from './docente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Docente } from './entities/docente.entity';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';
import { VerifyDocenteEmailMiddleware } from 'src/middlewares/verify-docente-email/verify-docente-email.middleware';
import { VerifyDocenteDocMiddleware } from 'src/middlewares/verify-docente-doc/verify-docente-doc.middleware';

@Module({
  imports:[TypeOrmModule.forFeature([Docente])],
  controllers: [DocenteController],
  providers: [DocenteService]
})
export class DocenteModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware).forRoutes(DocenteController)
      .apply(VerifyDocenteEmailMiddleware, VerifyDocenteDocMiddleware)
      .forRoutes({ path:'docente/add-docente', method: RequestMethod.POST})
  }
}
