import { Body, Controller, Post } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotDto } from './dto/bot.dto';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService ) {}


  @Post('send-message')
  sendMessageWhatsapp(@Body() botDto:BotDto){
      return this.botService.senMessageWhatsap(botDto);
  }

}
