import { Module } from '@nestjs/common';
import { DenominacionServicioService } from './denominacion-servicio.service';
import { DenominacionServicioController } from './denominacion-servicio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DenominacionServicio } from './entities/denominacion-servicio.entity';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token.middleware';
import { RequestMethod } from '@nestjs/common/enums';

@Module({
  imports:[TypeOrmModule.forFeature([DenominacionServicio])],
  controllers: [DenominacionServicioController],
  providers: [DenominacionServicioService]
})
export class DenominacionServicioModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude({ path:'/denomin-servicio/get-lista-denomin-servicios', 
                 method:RequestMethod.GET })
      .forRoutes(DenominacionServicioController)
  }

}
