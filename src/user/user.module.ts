import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { VerifyUserMiddleware } from 'src/middlewares/verify-email/verify-email.middleware';
import { VerifyIdMiddleware } from 'src/middlewares/verify-id/verify-id.middleware';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';

@Module({
  imports:[TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware).forRoutes(UserController)
      .apply(VerifyUserMiddleware)
      .forRoutes({ path:'user', method: RequestMethod.POST})
      .apply(VerifyIdMiddleware)
      .forRoutes({ path:'user/get-one-user/:id', method: RequestMethod.GET})
  }

}
