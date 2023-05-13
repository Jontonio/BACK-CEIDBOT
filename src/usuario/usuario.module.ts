import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UserController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { VerifyEmailUsuarioMiddleware } from 'src/middlewares/verify-email-usuario.middleware';
import { VerifyIdUsuarioMiddleware } from 'src/middlewares/verify-id-usuario.middleware';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token.middleware';
import { VerifyDniUsuarioMiddleware } from 'src/middlewares/verify-dni-usuario.middleware';
import { Rol } from 'src/rol/entities/rol.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Usuario,Rol])],
  controllers: [UserController],
  providers: [UsuarioService]
})
export class UsuarioModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude({ path:'usuario/usuario-reniec', method:RequestMethod.POST })
      .forRoutes(UserController)
      .apply(VerifyEmailUsuarioMiddleware, VerifyDniUsuarioMiddleware)
      .forRoutes({ path:'usuario/add-usuario', method: RequestMethod.POST})
      .apply(VerifyIdUsuarioMiddleware)
      .forRoutes({ path:'usuario/get-one-usuario/:id', method: RequestMethod.GET},
                 { path:'usuario/delete-usuario/:id',  method: RequestMethod.DELETE},
                 { path:'usuario/enable-usuario/:id',  method: RequestMethod.PATCH},
                 { path:'usuario/update-usuario/:id',  method: RequestMethod.PATCH},
                 { path:'usuario/update-password-usuario/:id',  method: RequestMethod.PATCH})
  }

}
