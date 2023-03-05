import { SubscribeMessage, 
         WebSocketGateway,
         WebSocketServer, 
         OnGatewayInit } from '@nestjs/websockets';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets/interfaces';

import { Socket, Server } from 'socket.io';
import { sendPaymentGirlFriend } from 'src/helpers/messageGirlFiend';
import { onMessageObjects, onMessagePeople } from 'src/helpers/messagePeople';
import { Buttons, Client, LocalAuth, Location, MessageMedia, List, Chat } from "whatsapp-web.js";

import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';
import { CursoService } from 'src/curso/curso.service';
import { DocenteService } from 'src/docente/docente.service';
import { UsuarioService } from 'src/usuario/usuario.service';

moment.locale('es');

@WebSocketGateway({
  cors:{ origin:'*' }
})
export class AppGateway implements OnGatewayInit, 
                                   OnGatewayConnection,
                                   OnGatewayDisconnect{
  client    : Client;
  @WebSocketServer() server:Server;
  
  constructor(private readonly _curso:CursoService,
              private readonly _docente:DocenteService,
              private readonly _usuario:UsuarioService){}

  afterInit(server: Server) {

    this.server = server;
    this.client = new Client({ puppeteer: { headless: true,args: ['--no-sandbox'] },
            authStrategy: new LocalAuth({ dataPath:'auth-whatsapp' }),
    });

    // this.boot()
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    //Do stuffs
  }
  
  handleConnection(client: Socket) {
    console.log(`Connected ${client.id}`);
    /** Emit welcome socket */
    client.emit('welcome-ceidbot',{ data:'', ok:true, msg:'Bienvenido al sistema CEIDBOT' } );
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client:Socket){
    client.emit('sendMessage', { msg:"Hola mundo from NESTJS" });
  }

  @SubscribeMessage('Nuevo_curso')
  async handleNewCourse(client: Socket, payload: any){
    const res = await this._curso.findAll({limit:5, offset:0})
    client.broadcast.emit('list_actualizada_cursos', res );
  }

  @SubscribeMessage('Nuevo_docente')
  async handleNewTeacher(client: Socket){
    const res = await this._docente.findAll({limit:5, offset:0})
    client.broadcast.emit('list_actualizada_docentes', res );
  }

  @SubscribeMessage('Nuevo_usuario')
  async handleNewUser(client:Socket){
    const res =  await this._usuario.findAll({ limit:5, offset:0 });
    client.broadcast.emit('list_actualizada_usuarios', res );
  }

  @SubscribeMessage('usuario_eliminado')
  async handleDeleleteUser(){
    const res =  await this._usuario.findAll({ limit:5, offset:0 });
    this.server.emit('list_actualizada_usuarios', res );
  }

  

  private boot(){

    this.client.on('authenticated', () => {
        console.log("Session iniciada");
        // this.io.emit('boot',{ msg:"Usuario autenticado", qr:'', authenticated:true })
    })
    
    this.client.on('qr', (qr:any) => {
        // qrcode.generate(qr,{small:true});
        console.log("escane el qr de whatsapp");
        // this.io.emit('boot',{ msg:"Escane el código QR de whatsApp", qr , authenticated:false })
    });
    
    this.client.on('ready', () => {
        // this.io.emit('boot',{ msg:"Código escaneado correctamete", qr:'' , authenticated:true })
        console.log('Client is ready!');
    });
    
    this.client.on("disconnected",(reson)=> {
        console.log("se cerró sesión: ", reson);
        this.client.destroy();
        this.client.initialize();
    })

    this.client.on('message', async (message) => {

        const chat:Chat = await message.getChat()

        if(!chat.isGroup){
            onMessagePeople(this.client, message);
            onMessageObjects(this.client, message);
        }
        
    })

    this.client.initialize();
  }

  @Cron('45 12 * * *')
  sendAutoMessage(){
    sendPaymentGirlFriend(this.client);
  }

  

}
