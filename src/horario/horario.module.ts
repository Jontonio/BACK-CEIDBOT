import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { HorarioService } from './horario.service';
import { HorarioController } from './horario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Horario } from './entities/horario.entity';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';

@Module({
  imports:[TypeOrmModule.forFeature([Horario])],
  controllers: [HorarioController],
  providers: [HorarioService]
})
export class HorarioModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware).forRoutes(HorarioController)
  }
}
