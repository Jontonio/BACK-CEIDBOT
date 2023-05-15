import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { WhatsappGateway } from 'src/socket/whatsapp.gateway';
import { BotDto } from './dto/bot.dto';
import { HandleMessageWhatsapp } from 'src/class/global-handles';

@Injectable()
export class BotService {

    constructor(private readonly whatsapptGateway:WhatsappGateway){}

    async senMessageWhatsap(botDto:BotDto){
        try {
            const res = await this.whatsapptGateway.sendMessageWhatsapp(botDto);
            return new HandleMessageWhatsapp(`Mensaje enviado al número ${botDto.Nombres} correctamente`, true, res);
        } catch (e) {
           console.log(e) 
           throw new InternalServerErrorException("ERROR AL ENVIAR MENSAJE DE WHATSAPP")
        }
    }

    
}
