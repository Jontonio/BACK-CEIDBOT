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
import { CourseService } from 'src/course/course.service';

moment.locale('es');

@WebSocketGateway({
  cors:{
    origin:'*'
  }
})
export class AppGateway implements OnGatewayInit, 
                                   OnGatewayConnection,
                                   OnGatewayDisconnect{
  client    : Client;
  @WebSocketServer() server:Server;
  
  afterInit(server: Server) {

    this.server = server;
    this.client = new Client({ puppeteer: { headless: true,args: ['--no-sandbox']},
            authStrategy: new LocalAuth({dataPath:'auth-whatsapp'}),
    });

    // this.boot()
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    //Do stuffs
  }
  
  handleConnection(client: Socket) {
    console.log(`Connected ${client.id}`);
    this.handleSendMessage(client);
    client.emit('welcome',{msg:"Bienvenido usario"});
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client:Socket){
    console.log("sendMessage");
    this.server.emit('sendMessage', {msg:"Hola mundo from NESTJS"});
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    this.server.emit('message', payload);
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
