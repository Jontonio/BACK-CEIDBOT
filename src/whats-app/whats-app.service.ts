import { Injectable,  InternalServerErrorException } from '@nestjs/common';
import { WhatsAppDto } from './dto/whats-app.dto';
import { WhatsappGateway } from 'src/socket/whatsapp.gateway';
import { HandleMessageWhatsapp } from 'src/class/global-handles';

@Injectable()
export class WhatsAppService {

    constructor(private readonly whatsapptGateway:WhatsappGateway){}

    async senMessageWhatsap(whatsAppDto:WhatsAppDto){
        try {
            const res = await this.whatsapptGateway.sendMessageWhatsapp(whatsAppDto);
            return new HandleMessageWhatsapp(`Mensaje enviado al número +${whatsAppDto.Numero.split('@')[0]} correctamente`, true, res);
        } catch (e) {
           console.log(e) 
           throw new InternalServerErrorException("ERROR AL ENVIAR MENSAJE DE WHATSAPP")
        }
    }

}
