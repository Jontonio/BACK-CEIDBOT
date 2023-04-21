import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Pago])],
  controllers: [PagoController],
  providers: [PagoService]
})
export class PagoModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude({ path:'mensualidad/pago-mensualidad', method:RequestMethod.POST})
      .forRoutes(PagoController)
  }
}
