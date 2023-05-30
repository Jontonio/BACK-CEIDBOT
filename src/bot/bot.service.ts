import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BotSendDto } from './dto/bot-send.dto';
import { WhatsappGateway } from 'src/socket/whatsapp.gateway';
import { HandleWhatsapp } from 'src/class/global-handles';


@Injectable()
export class BotService {

    constructor(private readonly whatsappGateway:WhatsappGateway){}

    /**
     * This function generates a QR code for initializing WhatsApp and logs the result or any errors.
     */
    async generateQrWhatsapp(){
        try {
            const res = await this.whatsappGateway.inicializarWhatsApp();
            console.log(res)
        } catch (e) {
            console.log(e.message)
            console.log("ERROR AL INICIALIZAR WHATSAPP QR")
        }
    }

   /**
    * This function sends a message via WhatsApp using a bot and returns a success message or an error
    * message if the message fails to send.
    * @param {BotSendDto} botDto - BotSendDto, which is an object containing the necessary information
    * to send a message via WhatsApp, such as the recipient's phone number and the message content.
    * @returns an instance of the `HandleWhatsapp` class with a message indicating whether the message
    * was sent successfully or not, and the response from the `whatsappGateway.sendMessageWhatsapp`
    * method. If there was an error, it throws an `InternalServerErrorException`.
    */
    async senMessageWhatsap(botDto:BotSendDto){
        try {
            if(!this.whatsappGateway.isAuth){
                return new HandleWhatsapp(`CEIBOT aún no está listo para enviar mensajes. espere un momento o visualice el apartado del CHATBOT`, false, null);
            }
            const res = await this.whatsappGateway.sendMessageWhatsapp(botDto);
            console.log(res)
            return new HandleWhatsapp(`Mensaje enviado al número ${botDto.Nombres} correctamente`, true, res);
        } catch (e) {
            console.log(e.message) 
            throw new InternalServerErrorException("ERROR AL ENVIAR MENSAJE DE WHATSAPP")
        }
    }


    
}
