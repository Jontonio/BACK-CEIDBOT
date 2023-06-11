import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BotSendDto } from './dto/bot-send.dto';
import { WhatsappGateway } from 'src/socket/whatsapp.gateway';
import { HandleConfigNotification, HandleWhatsapp } from 'src/class/global-handles';
import { CronJob } from 'cron';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigNotification } from './entities/configNotification.entity';
import { Repository } from 'typeorm';
import { UpdateConfigNotificacionDto } from './dto/update-configNotification.dto';
import { ConfigNotificacionDto } from './dto/configNotification.dto copy';

@Injectable()
export class BotService {

    private cronJob: any;
    private HoraNotificacion = 18;
    private MinutoNotificacion = 0;

    constructor(@InjectRepository(ConfigNotification) 
                private confNotificationModel:Repository<ConfigNotification>,
                private whatsappGateway:WhatsappGateway){
        this.getDataConfigNotification();
        this.setNewTimeNotificacions(this.HoraNotificacion, this.MinutoNotificacion);
    }

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
            console.log('is auth whatsApp',this.whatsappGateway.statusAuth())
            console.log(this.whatsappGateway.statusAuth())
            if(this.whatsappGateway.statusAuth()){
                const res = await this.whatsappGateway.sendMessageWhatsapp(botDto);
                return new HandleWhatsapp(`Mensaje enviado al número ${botDto.Nombres} correctamente`, true, res);
            }
            return new HandleWhatsapp(`CEIBOT aún no está listo para enviar mensajes. espere un momento o visualice el apartado del CHATBOT`, false, null);
        } catch (e) {
            console.log(e.message) 
            throw new InternalServerErrorException("ERROR AL ENVIAR MENSAJE DE WHATSAPP - VERIFIQUE EL CHATBOT")
        }
    }

    async getInfoCelphone(){
        try {
            return new HandleWhatsapp('Información del cliente WhatsApp', true, this.whatsappGateway.getInfoCelphone());
        } catch (e) {
            console.log(e.message)
            throw new InternalServerErrorException("ERROR OBTENER INFORMACIÓN WHATSAPP")
        }
    }

    async getTimeNotification(){
        try {
            const data = await this.confNotificationModel.find();
            const firstData = (data.length!=0)?data[0]:null;
            return new HandleConfigNotification('Tiempo de notifiación', true, firstData);
        } catch (e) {
            console.log(e.message);
            throw new InternalServerErrorException('ERROR OBTENER TIME NOTIFICACION');
        }
    }

    setNewTimeNotificacions(hora:number, minuto:number){
        try {

            const cronExpression = `0 ${minuto} ${hora} * * *`;
            
            if (this.cronJob) {
                this.cronJob.stop(); // Detener el cron job anterior si existe
            }

            this.cronJob = new CronJob(cronExpression, async () => {
                try {
                    // realizar el envio de mensajes a estudiante sin pago a la fecha.
                    await this.whatsappGateway.sendMessageEstudiante();
                    console.log("Envio de mensajes correctamente")
                } catch (e) {
                    throw new InternalServerErrorException('ERROR AL ENVIAR MENSAJES DESDE EL SERVICIO');
                }
            });

            this.cronJob.start(); // Iniciar el nuevo cron job

        } catch (e) {
            console.log(e.message)
            throw new InternalServerErrorException("ERROR OBTENER INFORMACIÓN WHATSAPP")
        }
    }

    async updateTimeNotifications(Id:number, upConfigNotificacionDto:UpdateConfigNotificacionDto){
        try {
            // verificar si existe data
            const existData = await this.confNotificationModel.findOneBy({Id});

            if(!existData){
                throw new NotFoundException(`No se encontró la configuración con el ID ${Id}`);
            }
            // actualizar data
            await this.confNotificationModel.update({Id}, upConfigNotificacionDto);
            const resData = await this.confNotificationModel.findOneBy({Id});
            //set nuevos valores
            this.MinutoNotificacion = resData.MinutoNotificacion;
            this.HoraNotificacion = resData.HoraNotificacion;
            // actualizar cron job
            this.setNewTimeNotificacions(this.HoraNotificacion, this.MinutoNotificacion);

            return new HandleConfigNotification('Se ha actualizado el tiempo de notificación de WhatsApp', true, resData);
        } catch (e) {
            console.log(e.message)
            throw new InternalServerErrorException('ERROR AL ACUALIZAR TIME NOTIFICACION')
        }
    }

    async getDataConfigNotification(){
        try {
            //obtiene los datos para la notificación
            const data = await this.confNotificationModel.find();
            // verifica si hay datos y si no hay inserta datos
            if(data.length==0){
                const insertNotify:ConfigNotificacionDto = {
                    HoraNotificacion:18, 
                    MinutoNotificacion:0, 
                    DescriptionNotificacion:'Representa la hora y minuto en que notificará el chatbot a estudiantes'
                }
                const newData = await this.confNotificationModel.save(insertNotify);
                this.HoraNotificacion = newData.HoraNotificacion;
                this.MinutoNotificacion = newData.MinutoNotificacion;
            }else{
                this.HoraNotificacion = data[0].HoraNotificacion;
                this.MinutoNotificacion = data[0].MinutoNotificacion;
            }

             // actualizar cron job
             this.setNewTimeNotificacions(this.HoraNotificacion, this.MinutoNotificacion);

                
        } catch (e) {
            throw new InternalServerErrorException('ERRO GET CONFIG NOTIFICATION')
        }
    }
    
}
