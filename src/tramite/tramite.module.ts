import { Module, MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import { TramiteService } from './tramite.service';
import { TramiteController } from './tramite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tramite } from './entities/tramite.entity';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';
import { Estudiante } from 'src/estudiante/entities/estudiante.entity';
import { Pago } from 'src/pago/entities/pago.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Tramite, Estudiante, Pago])],
  controllers: [TramiteController],
  providers: [TramiteService]
})
export class TramiteModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude({ path:'tramite/register-new-tramite', method:RequestMethod.POST })
      .forRoutes(TramiteController)
  }
}
