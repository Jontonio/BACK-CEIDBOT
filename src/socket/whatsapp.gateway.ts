import { WebSocketGateway, 
         WebSocketServer} from '@nestjs/websockets';
import { InternalServerErrorException } from '@nestjs/common'
import { whatsApp } from 'src/helpers/whatsapp';
import { Socket, Server } from 'socket.io';
import { Client, LocalAuth } from 'whatsapp-web.js';
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

  handleConnection(client: Socket) {
    console.log(`Connected ${client.id}`);
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
  
}
