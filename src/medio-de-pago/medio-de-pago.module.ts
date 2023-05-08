import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MedioDePagoService } from './medio-de-pago.service';
import { MedioDePagoController } from './medio-de-pago.controller';
import { MedioDePago } from './entities/medio-de-pago.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';

@Module({
  imports:[TypeOrmModule.forFeature([MedioDePago])],
  controllers: [MedioDePagoController],
  providers: [MedioDePagoService]
})
export class MedioDePagoModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude({ path:'medio-de-pago/get-all-medios-pago', method:RequestMethod.GET })
      .forRoutes(MedioDePagoController)
  }
}
