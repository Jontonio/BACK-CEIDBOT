import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CategoriaPagoService } from './categoria-pago.service';
import { CategoriaPagoController } from './categoria-pago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaPago } from './entities/categoria-pago.entity';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';

@Module({
  imports:[TypeOrmModule.forFeature([CategoriaPago])],
  controllers: [CategoriaPagoController],
  providers: [CategoriaPagoService]
})
export class CategoriaPagoModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude({ path:'/categoria-pago/get-all-categoria-pago', 
                 method:RequestMethod.GET })
      .forRoutes(CategoriaPagoController)
  }
}
