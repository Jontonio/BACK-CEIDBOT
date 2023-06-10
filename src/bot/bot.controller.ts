import { Body, Controller, Get, Post, Patch, Param } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotSendDto } from './dto/bot-send.dto';
import { UpdateConfigNotificacionDto } from './dto/update-configNotification.dto';

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

  @Patch('update-time-notification-bot/:id')
  setNewTimeNotificacions(@Param('id') id:number, @Body() upConfigNotificacionDto:UpdateConfigNotificacionDto){
    return this.botService.updateTimeNotifications(+id,upConfigNotificacionDto);
  }

  @Get('get-time-notification')
  getTimeNotification(){
    return this.botService.getTimeNotification();
  }

}
