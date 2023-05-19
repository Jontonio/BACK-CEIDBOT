import { WebSocketGateway, 
         WebSocketServer} from '@nestjs/websockets';
import { InternalServerErrorException } from '@nestjs/common'
import { Socket, Server } from 'socket.io';
import { Chat, Client, LocalAuth } from 'whatsapp-web.js';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import * as moment from "moment";
import { BotSendDto } from 'src/bot/dto/bot-send.dto';
import { MessageStatusBot } from 'src/class/Bot';
import { chatbot } from 'src/helpers/chatbot';
moment.locale('es');

@WebSocketGateway()
export class WhatsappGateway {
  
  @WebSocketServer() server:Server;

  client:Client;
  isAuth:boolean;
  messageStatusBot:MessageStatusBot;
  countQrShow:number;
  showQR:boolean;

  constructor(private readonly dataSource:DataSource){
    this.countQrShow = 0;
    this.isAuth = false;
    this.showQR = false;
  }

  async afterInit(server: Server) {
    this.server = server;
    this.client = new Client({ puppeteer: { 
      headless: true,
      args: ['--no-sandbox'] 
    },
    authStrategy: new LocalAuth({ dataPath:'auth-whatsapp' }),
    });
    
    this.whatsapp();
  }

  handleConnection(client: Socket) {
    
    if(this.isAuth){
      this.messageStatusBot = new MessageStatusBot('Activo','CEIDBOT está activo 🚀. Listo para recibir mensajes.', null, true) 
      this.emitStatusClientBot(client, this.messageStatusBot);
      this.showQR = false;
    }

    if(this.showQR){
      this.messageStatusBot = new MessageStatusBot('Apagado','Tiene que generar el código QR para continuar con CEIDBOT.', null, false, true);
      this.emitStatusServerBot(this.server, this.messageStatusBot);
    }

  }

  whatsapp(){

    this.inicializarWhatsApp();

    // this.client.on('loading_screen', (percent, message) => {
    //   console.log('LOADING SCREEN', percent, message);
    // });

    this.client.on('authenticated', async () => {
      this.isAuth = true;
      this.showQR = false;
      console.log("Session iniciada");
    })

    // this.client.on('auth_failure', msg => {
    //   // Fired if session restore was unsuccessful
    //   console.error('AUTHENTICATION FAILURE', msg);
    // });

    this.client.on('qr', (qr:any) => {
      this.isAuth = false;
      console.log("escane el qr de whatsapp");
      this.messageStatusBot = new MessageStatusBot('Escanne QR','Escane el código QR de WhatsApp para terminar de configurar CEIDBOT.', qr, false);
      this.emitStatusServerBot( this.server, this.messageStatusBot);
      this.countQrShow ++;
      this.verifyCountQrShow(this.countQrShow);
    });

    this.client.on('ready', () => {
      this.isAuth = true;
      this.showQR = false;
      console.log('Client is ready!');
      this.messageStatusBot = new MessageStatusBot('Activo','CEIDBOT está activo 🚀. Listo para recibir mensajes.', null, true);
      this.emitStatusServerBot(this.server, this.messageStatusBot);
    });

    this.client.on("disconnected",async (reson)=> {
      try {
        console.log("se cerró sesión: ", reson);
        this.isAuth = false;
        this.showQR = false;
        this.countQrShow = 0;
        this.inicializarWhatsApp();
      } catch (e) {
        console.log('disconnected: ', e)
      }
    })

    this.client.on('message', async (message) => {
        const chat:Chat = await message.getChat()
        if(!chat.isGroup && message.type=='chat'){
          chatbot(this.client, message, this.dataSource);                
        }
    })

  }

  async hidenQRWhatsApp(){
    try {
      this.isAuth = false;
      this.showQR = true;
      this.countQrShow = 0;
      this.messageStatusBot = new MessageStatusBot('Apagado','Tiene que generar el código QR para continuar con CEIDBOT.', null, false, true);
      this.emitStatusServerBot(this.server, this.messageStatusBot);
      return await this.client.destroy();
    } catch (e) {
      console.error('Error al cerrar la sesión de WhatsApp:', e);
    }
  }

  async inicializarWhatsApp(){
    try {
      this.messageStatusBot = new MessageStatusBot('Prendiendo','Se está activando sesión de whatsApp para CEIDBOT. Espere un momento', null, false);
      this.emitStatusServerBot(this.server, this.messageStatusBot);
      return this.client.initialize().catch(_ => _);
      // return this.client.initialize().then().catch(_ => _);
    } catch (e) {
      console.log("Error al inicializar whatsapp: ", e)
    }
  }

  async sendMessageWhatsapp({ Numero, Message }:BotSendDto ){
    try {
      return await this.client.sendMessage(Numero, Message);
    } catch (e) {
      throw new InternalServerErrorException("ERROR AL ENVIAR MENSAJE")
    }
  }

  verifyCountQrShow(count:number, numMax = 7){
    if(count===numMax || count >= numMax){
      this.hidenQRWhatsApp();
    }
  }

  emitStatusClientBot(client:Socket, isAuthMessageBot:MessageStatusBot){
    client.emit('boot', isAuthMessageBot );
  }

  emitStatusServerBot(server:Server,isAuthMessageBot:MessageStatusBot){
    server.emit('boot', isAuthMessageBot );
  }

  /** enviar comunicado un día antes, el mismo dia, un día despues de legue la fecha programada de los módulos*/
  @Cron('0 */1 * * * *', { timeZone:'America/Lima' })
  // @Cron('0 */1 * * * *', { timeZone:'America/Lima' })
  async sendMessageEstudiante(){
    // try {
    //   if(this.whatsapp.isAuth){
    //     const lista:PersonaComunicado[] = await this.getEstudiantesSinPagoMensualidad();
    //     if(lista.length!=0){
    //       for(const estudiante of lista){
    //         const {Celular, CodePhone, Nombres, NombreCurso, FechaPago, Nivel} = estudiante;
    //         const Numero = `${CodePhone}${Celular}`.replace('+','').concat('@c.us').trim();
    //         const Message = `Hola ${Nombres}, \n Te escribimos desde para recordarte que tienes un pago pendiente por el módulo del curso de ${NombreCurso} ${Nivel}, cuya fecha límite de pago es el día ${moment(FechaPago).format('YYYY-MM-DD')}.
    //         Por favor, asegúrate de realizar el pago a tiempo para evitar inconvenientes y no perder acceso al contenido del curso. Si ya realizaste el pago, por favor ignora este mensaje.
    //         Quedamos atentos a cualquier duda o consulta que tengas.\n Saludos cordiales CEIBOT`;
    //         const whatsAppDto:BotSendDto = {Numero, Nombres, Message};
    //         await this.sendMessageWhatsapp( whatsAppDto );
    //         console.log("Mensaje enviado a "+Nombres)
    //       }
    //     }
    //   }
    // } catch (e) {
    //   throw new InternalServerErrorException("SEND MESSAGE ESTUDIANTE")
    // }
  }

  async getEstudiantesSinPagoMensualidad(){
    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    // try {
    //   const listaEstudiantes = await queryRunner.query(`
    //   SELECT estudiante.TipoDocumento, 
    //          estudiante.Documento, 
    //          estudiante.Nombres, 
    //          estudiante.ApellidoPaterno, 
    //          estudiante.ApellidoMaterno, 
    //          estudiante.CodePhone,
    //          estudiante.Celular,
    //          FechaPago,
    //          curso.NombreCurso,
    //          nivel.Nivel
    //   FROM estudiante
    //   INNER JOIN estudiante_en_grupo ON estudiante.Id = estudiante_en_grupo.estudianteId
    //   INNER JOIN grupo ON estudiante_en_grupo.grupoId = grupo.Id
    //   INNER JOIN curso ON grupo.cursoId = curso.Id
    //   INNER JOIN nivel on nivel.Id = curso.nivelId
    //   INNER JOIN grupo as reg_grupo on curso.Id = grupo.cursoId
    //   INNER JOIN grupo_modulo ON grupo.Id = grupo_modulo.grupoId
    //   WHERE grupo.Estado != false AND
    //         grupo.estadoGrupoId != 3 AND 
    //         estudiante_en_grupo.Estado != false  AND 
    //         grupo_modulo.FechaPago >= DATE_SUB(CURDATE(), INTERVAL 1 DAY) AND
    //         grupo_modulo.FechaPago <= DATE_ADD(CURDATE(), INTERVAL 1 DAY)
    //   AND NOT EXISTS (
    //     SELECT * FROM pago
    //     WHERE pago.grupoModuloId = grupo_modulo.Id AND pago.Verificado IS NOT NULL AND pago.CodigoVoucher IS NOT NULL AND pago.CodigoVoucher <> '' AND (pago.Estado IS NULL OR pago.Estado != 0)
    //     AND pago.estudianteEnGrupoId = estudiante_en_grupo.Id AND pago.grupoModuloId = grupo_modulo.Id
    //   );
    //   `);
    //   await queryRunner.commitTransaction();
    //   return listaEstudiantes;
    // } catch (error) {
    //   await queryRunner.rollbackTransaction();
    //   throw error;
    //   console.log("ERROR GET LISTA ESTUDIANTES SIN MENSUALIDAD")
    // } finally {
    //   await queryRunner.release();
    // }
  }


  
}
