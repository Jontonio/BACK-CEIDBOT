import { Module } from '@nestjs/common';
import { GrupoService } from './grupo.service';
import { GrupoController } from './grupo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from './entities/grupo.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Grupo])],
  controllers: [GrupoController],
  providers: [GrupoService]
})
export class GrupoModule {}
