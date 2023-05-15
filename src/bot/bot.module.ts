import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { WhatsappGateway } from 'src/socket/whatsapp.gateway';
import { CursoService } from 'src/curso/curso.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bot } from './entities/bot.entity';
import { Curso } from 'src/curso/entities/curso.entity';
import { Modulo } from 'src/curso/entities/modulo.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Bot, Curso, Modulo])
  ],
  controllers: [BotController],
  providers: [BotService, 
              WhatsappGateway,
              CursoService
            ]
})
export class BotModule {}
