import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { Mora } from './entities/mora.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Pago, Mora])],
  controllers: [PagoController],
  providers: [PagoService]
})
export class PagoModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude({ path:'pago/register-pago', method:RequestMethod.POST})
      .forRoutes(PagoController)
  }
}
