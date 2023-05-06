import { Controller, Post, Body } from '@nestjs/common';
import { WhatsAppService } from './whats-app.service';
import { WhatsAppDto } from './dto/whats-app.dto';

@Controller('whatsapp')
export class WhatsAppController {

    constructor( private readonly _whatService:WhatsAppService){}

    @Post('send-message')
    sendMessageWhatsapp(@Body() whatsAppDto:WhatsAppDto){
        return this._whatService.senMessageWhatsap(whatsAppDto);
    }
}
