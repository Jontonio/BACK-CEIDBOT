import { SubscribeMessage, 
         WebSocketGateway, 
         WebSocketServer,
         OnGatewayInit, 
         MessageBody} from '@nestjs/websockets';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets/interfaces';
import { InternalServerErrorException } from '@nestjs/common'
import { whatsApp } from 'src/helpers/whatsapp';
import { Socket, Server } from 'socket.io';
import { Client, LocalAuth } from 'whatsapp-web.js';
import { Cron } from '@nestjs/schedule';
import { CursoService } from 'src/curso/curso.service';
import { WhatsAppDto } from 'src/whats-app/dto/whats-app.dto';


@WebSocketGateway()
export class WhatsappGateway {
  
  client: Client;
  whatsapp:whatsApp;
  @WebSocketServer() server:Server;

  constructor( private readonly _curso:CursoService ){}

  afterInit(server: Server) {

    this.server = server;
    this.client = new Client({ puppeteer: { headless: true,args: ['--no-sandbox'] },
            authStrategy: new LocalAuth({ dataPath:'auth-whatsapp' }),
    });

    this.whatsapp = new whatsApp(this.client, this.server, this._curso);
    this.whatsapp.start();
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  handleConnection(client: Socket) {
    console.log(`Connected ${client.id}`);
    /** Emit welcome socket */
    this.whatsapp.statusWhatsapp();
    client.emit('welcome-ceidbot',{ data:'', ok:true, msg:'Bienvenido al sistema CEIDBOT' } );
  }

  async sendMessageWhatsapp({ Numero, Message }:WhatsAppDto ){
    try {
      return await this.client.sendMessage(Numero, Message);
    } catch (e) {
      throw new InternalServerErrorException("ERROR AL ENVIAR MENSAJE")
    }
  }
  

  @Cron('45 12 * * *')
  sendAutoMessage(){
    console.log("auto mensaje")
  }
}
