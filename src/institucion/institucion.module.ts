import { Module, MiddlewareConsumer } from '@nestjs/common';
import { InstitucionService } from './institucion.service';
import { InstitucionController } from './institucion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institucion } from './entities/institucion.entity';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';

@Module({
  imports:[TypeOrmModule.forFeature([Institucion])],
  controllers: [InstitucionController],
  providers: [InstitucionService]
})
export class InstitucionModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .forRoutes(InstitucionController)
  }
  
}
