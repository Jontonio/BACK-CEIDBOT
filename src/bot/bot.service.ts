import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BotSendDto } from './dto/bot-send.dto';
import { WhatsappGateway } from 'src/socket/whatsapp.gateway';
import { HandleWhatsapp } from 'src/class/global-handles';


@Injectable()
export class BotService {

    constructor(private readonly whatsappGateway:WhatsappGateway){}

    async generateQrWhatsapp(){
        try {
            const res = await this.whatsappGateway.inicializarWhatsApp();
            console.log(res)
        } catch (e) {
            console.log("Error al inicializar whatsapp: ", e)
        }
    }

    async senMessageWhatsap(botDto:BotSendDto){
        try {
            if(!this.whatsappGateway.isAuth){
                return new HandleWhatsapp(`CEIBOT aún no está listo para enviar mensajes. espere un momento o visualice el apartado del CHATBOT`, false, null);
            }
            const res = await this.whatsappGateway.sendMessageWhatsapp(botDto);
            console.log(res)
            return new HandleWhatsapp(`Mensaje enviado al número ${botDto.Nombres} correctamente`, true, res);
        } catch (e) {
           console.log(e) 
           throw new InternalServerErrorException("ERROR AL ENVIAR MENSAJE DE WHATSAPP")
        }
    }


    
}
