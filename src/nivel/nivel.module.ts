import { MiddlewareConsumer, Module } from '@nestjs/common';
import { NivelService } from './nivel.service';
import { NivelController } from './nivel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nivel } from './entities/nivel.entity';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';

@Module({
  imports:[TypeOrmModule.forFeature([Nivel])],
  controllers: [NivelController],
  providers: [NivelService]
})
export class NivelModule {
    
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware).forRoutes(NivelController)
  }
}