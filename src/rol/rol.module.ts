import { Module } from '@nestjs/common';
import { RolService } from './rol.service';
import { RolController } from './rol.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token.middleware';

@Module({
  imports:[TypeOrmModule.forFeature([Rol])],
  controllers: [RolController],
  providers: [RolService]
})
export class RolModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware).forRoutes(RolController)
  }

}
