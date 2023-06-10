import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { WhatsappGateway } from 'src/socket/whatsapp.gateway';
import { CursoService } from 'src/curso/curso.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from 'src/curso/entities/curso.entity';
import { Modulo } from 'src/curso/entities/modulo.entity';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token.middleware';
import { ConfigNotification } from './entities/configNotification.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Curso, Modulo, ConfigNotification])
  ],
  controllers: [BotController],
  providers: [BotService, WhatsappGateway, CursoService ]
})
export class BotModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyTokenMiddleware).forRoutes(BotController)
  }
}
