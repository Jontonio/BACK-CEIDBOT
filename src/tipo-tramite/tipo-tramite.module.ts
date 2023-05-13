import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TipoTramiteService } from './tipo-tramite.service';
import { TipoTramiteController } from './tipo-tramite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token.middleware';
import { TipoTramite } from './entities/tipo-tramite.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TipoTramite])],
  controllers: [TipoTramiteController],
  providers: [TipoTramiteService]
})
export class TipoTramiteModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude({ path:'tipo-tramite/get-list-register', method:RequestMethod.GET })
      .forRoutes(TipoTramiteController)
  }
}
