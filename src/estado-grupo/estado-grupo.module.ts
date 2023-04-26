import { Module, MiddlewareConsumer } from '@nestjs/common';
import { EstadoGrupoService } from './estado-grupo.service';
import { EstadoGrupoController } from './estado-grupo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoGrupo } from './entities/estado-grupo.entity';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';

@Module({
  imports:[TypeOrmModule.forFeature([EstadoGrupo])],
  controllers: [EstadoGrupoController],
  providers: [EstadoGrupoService]
})
export class EstadoGrupoModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .forRoutes(EstadoGrupoController)
  }
}
