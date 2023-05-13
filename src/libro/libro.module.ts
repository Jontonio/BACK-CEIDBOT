import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LibroService } from './libro.service';
import { LibroController } from './libro.controller';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Libro } from './entities/libro.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Libro])],
  controllers: [LibroController],
  providers: [LibroService]
})
export class LibroModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .forRoutes(LibroController)
  }
}

