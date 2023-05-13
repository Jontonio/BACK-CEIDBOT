import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioService } from 'src/usuario/usuario.service';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token.middleware';

@Module({
  imports:[TypeOrmModule.forFeature([Usuario])],
  controllers: [AuthController],
  providers: [AuthService, UsuarioService]
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude({ 
        path:'auth/login', 
        method:RequestMethod.POST 
      },
      {
        path:'auth/logout', 
        method:RequestMethod.POST 
      },
      {
        path:'auth/reset-password', 
        method:RequestMethod.PATCH 
      },
      {
        path:'auth/change-password', 
        method:RequestMethod.PATCH 
      })
      .forRoutes(AuthController)
  }
}
