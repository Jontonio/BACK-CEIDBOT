import { Module, MiddlewareConsumer} from '@nestjs/common';
import { TramiteService } from './tramite.service';
import { TramiteController } from './tramite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tramite } from './entities/tramite.entity';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';

@Module({
  imports:[TypeOrmModule.forFeature([Tramite])],
  controllers: [TramiteController],
  providers: [TramiteService]
})
export class TramiteModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware).forRoutes(TramiteController)
  }
}
