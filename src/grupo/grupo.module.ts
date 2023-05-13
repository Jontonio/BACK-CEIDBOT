import { Module } from '@nestjs/common';
import { GrupoService } from './grupo.service';
import { GrupoController } from './grupo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from './entities/grupo.entity';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token.middleware';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { TipoGrupo } from './entities/tipo-grupo.entity';
import { RequestMethod } from '@nestjs/common/enums';
import { VerifyIdGrupoMiddleware } from 'src/middlewares/verify-id-grupo.middleware';
import { GrupoModulo } from './entities/grupoModulo.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Grupo, TipoGrupo, GrupoModulo])],
  controllers: [GrupoController],
  providers: [GrupoService]
})
export class GrupoModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude({path:'grupo/get-grupos-matricula', method:RequestMethod.GET})
      .forRoutes(GrupoController)
      .apply(VerifyIdGrupoMiddleware)
      .forRoutes({path:'grupo/get-one-grupo/:id', method: RequestMethod.GET})
  }

}
