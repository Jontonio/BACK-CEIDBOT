import { Module, RequestMethod } from '@nestjs/common';
import { DocenteService } from './docente.service';
import { DocenteController } from './docente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Docente } from './entities/docente.entity';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';
import { VerifyDocenteEmailMiddleware } from 'src/middlewares/verify-docente-email/verify-docente-email.middleware';
import { VerifyDocenteDocMiddleware } from 'src/middlewares/verify-docente-doc/verify-docente-doc.middleware';
import { VerifyIdDocenteMiddleware } from 'src/middlewares/verify-id-docente/verify-id-docente.middleware';

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
      .apply(VerifyIdDocenteMiddleware)
      .forRoutes({ path:'docente/get-one-docente/:id', method: RequestMethod.GET},
                 { path:'docente/delete-docente/:id', method: RequestMethod.DELETE})

  }
}
