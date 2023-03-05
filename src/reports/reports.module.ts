import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { UsuarioService } from 'src/usuario/usuario.service';

@Module({
  imports:[TypeOrmModule.forFeature([Usuario])],
  controllers: [ReportsController],
  providers: [ReportsService, UsuarioService]
})
export class ReportsModule {}
