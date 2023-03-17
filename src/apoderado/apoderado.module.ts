import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ApoderadoService } from './apoderado.service';
import { ApoderadoController } from './apoderado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apoderado } from './entities/apoderado.entity';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';

@Module({
  imports:[TypeOrmModule.forFeature([Apoderado])],
  controllers: [ApoderadoController],
  providers: [ApoderadoService]
})
export class ApoderadoModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .forRoutes(ApoderadoController)
  }

}
