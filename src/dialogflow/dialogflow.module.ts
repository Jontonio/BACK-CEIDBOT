import { Module, MiddlewareConsumer } from '@nestjs/common';
import { DialogflowService } from './dialogflow.service';
import { DialogflowController } from './dialogflow.controller';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token.middleware';

@Module({
  controllers: [DialogflowController],
  providers: [DialogflowService]
})
export class DialogflowModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyTokenMiddleware).forRoutes(DialogflowController)
  }
}
