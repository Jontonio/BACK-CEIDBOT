import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioService } from 'src/usuario/usuario.service';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Usuario])],
  controllers: [AuthController],
  providers: [AuthService, UsuarioService]
})
export class AuthModule {}
