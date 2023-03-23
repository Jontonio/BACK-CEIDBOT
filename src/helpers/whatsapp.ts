import { Buttons, Client, LocalAuth, Location, MessageMedia, List, Chat } from "whatsapp-web.js";
import { Server } from 'socket.io';
import { MessageStatusBot } from "../class/Bot";
import { chatbot } from "./chatbot";
import { CursoService } from "src/curso/curso.service";

class whatsApp {

    client:Client;
    server:Server;
    isAuth:boolean;
    _curso:CursoService;

    constructor(client:Client, server:Server, _curso:CursoService){
        this.client = client;
        this.server = server;
        this.isAuth = false;
        this._curso = _curso;
    }

    statusWhatsapp(){

        if(this.isAuth){
            console.log(this.isAuth)
            const messageStatusBot = new MessageStatusBot('CEIBOT ready 🚀', null, true );
            this.sendStatuBot(messageStatusBot);
        }else{
            console.log(this.isAuth)
            const messageStatusBot = new MessageStatusBot('Verificando sesión...', null, false );
            this.sendStatuBot(messageStatusBot);
        }
    }

    sendStatuBot(statusMessageBot:MessageStatusBot){
        this.server.emit('boot', statusMessageBot );
    }

    authenticated(){

        this.client.on('authenticated', async () => {
            this.isAuth = true;
            console.log("Session iniciada");
        })

    }

    qr(){

        this.client.on('qr', (qr:any) => {
            // qrcode.generate(qr,{small:true});
            console.log("escane el qr de whatsapp");
            const messageStatusBot = new MessageStatusBot('Escane el código QR', qr, false );
            this.sendStatuBot(messageStatusBot);
        });

    }

    ready(){

        this.client.on('ready', () => {
            //  io.emit('boot',{ msg:"Código escaneado correctamete", qr:'' , authenticated:true })
            console.log('Client is ready!');
            const messageStatusBot = new MessageStatusBot('CEIBOT ACTIVO 🚀', null, true );
            this.sendStatuBot(messageStatusBot);
        });

    }
    
    logout(){
        return this.client.destroy().then( res => {
            console.log(res)
        }).catch( e => {
            console.log(e)
        })
    }

    message(){

        this.client.on('message', async (message) => {
            const chat:Chat = await message.getChat()
            if(!chat.isGroup && message.type=='chat'){
                chatbot(this.client, message, this._curso);                
            }
        })

    }

    disconnected(){

        this.client.on("disconnected",(reson)=> {
            try {
                console.log("se cerró sesión: ", reson);
                this.logout();
                this.client.initialize();
            } catch (e) {
                console.log('disconnected: ', e)
            }
        })

    }

    initialize(){
        this.client.initialize();
    }

    start(){
        this.authenticated();
        this.qr();
        this.ready();
        this.initialize();
        this.message();
        this.disconnected();
    }

  }

  export { whatsApp }