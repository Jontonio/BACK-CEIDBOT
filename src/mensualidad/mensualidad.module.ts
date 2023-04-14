import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MensualidadService } from './mensualidad.service';
import { MensualidadController } from './mensualidad.controller';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mensualidad } from './entities/mensualidad.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Mensualidad])],
  controllers: [MensualidadController],
  providers: [MensualidadService]
})
export class MensualidadModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware).forRoutes(MensualidadController)
  }
}
