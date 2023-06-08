import { Body, Controller, Get, Post } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotSendDto } from './dto/bot-send.dto';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService ) {}

  @Post('send-message')
  sendMessageWhatsapp(@Body() botDto:BotSendDto){
      return this.botService.senMessageWhatsap(botDto);
  }

  @Get('generate-qr-whatsapp')
  generateQrWhatsapp(){
    return this.botService.generateQrWhatsapp();
  }

  @Get('info-whatsapp')
  infoWhatsapp(){
    return this.botService.getInfoCelphone();
  }

}
