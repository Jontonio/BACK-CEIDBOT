import { Buttons, Client, LocalAuth, Location, MessageMedia, List, Chat } from "whatsapp-web.js";
import { Server } from 'socket.io';
import { MessageStatusBot } from "../class/Bot";
import { chatbot } from "./chatbot";

class whatsApp {

    client:Client;
    isAuth:boolean;
    
    constructor(){
        this.client = new Client({ puppeteer: { 
            headless: true,
            args: ['--no-sandbox'] 
        }, 
        authStrategy: new LocalAuth({ dataPath:'auth-whatsapp' }) });
        this.isAuth = false;
    }

    waitingWhatsapp(){

        if(this.isAuth){
            console.log(this.isAuth)
            // const messageStatusBot = new MessageStatusBot('CEIBOT está activo 01 🚀', null, true );
            // this.sendStatuBot(messageStatusBot);
        }else{
            console.log(this.isAuth)
            // const messageStatusBot = new MessageStatusBot('Verificando sesión de CEIDBOT...', null, false );
            // this.sendStatuBot(messageStatusBot);
        }
    }

    // sendStatuBot(statusMessageBot:MessageStatusBot){
    //     this.server.emit('boot', statusMessageBot );
    // }

    authenticated(){

        this.client.on('authenticated', async () => {
            this.isAuth = true;
            console.log("Session iniciada");
        })

    }

    qr(){
        this.client.on('qr', (qr:any) => {
            console.log("escane el qr de whatsapp");
            // const messageStatusBot = new MessageStatusBot('Escane el código QR', qr, false );
            // this.sendStatuBot(messageStatusBot);
        });

    }

    ready(){

        this.client.on('ready', () => {
            //  io.emit('boot',{ msg:"Código escaneado correctamete", qr:'' , authenticated:true })
            console.log('Client is ready!');
            // const messageStatusBot = new MessageStatusBot('CEIBOT está activo 🚀 02', null, true );
            // this.sendStatuBot(messageStatusBot);
        });

    }
    
    logout(){
        return this.client.destroy();
    }

    message(){

        this.client.on('message', async (message) => {
            const chat:Chat = await message.getChat()
            if(!chat.isGroup && message.type=='chat')
                // const res = await GPT( message.body );
                console.log(message)
                this.client.sendMessage(message.from, "prueba" )
                // chatbot(this.client, message, this._curso);                
            
        })

    }

    async sendMessage(message:any, to:string){
        await this.client.sendMessage(to,`😬 Hola este es una prueba. ${message}`);   
    }

    async apagarWhatsApp(){
        try {
            await this.client.destroy();
            console.log("Whatsapp cerrado")
        } catch (e) {
            console.error('Error al cerrar la sesión de WhatsApp:', e);
        }
    }

    async prenderWhatsApp(){
        try {
            await this.client.initialize().catch(_ => _);
            console.log("Whatsapp inicializado")
        } catch (e) {
            console.log("Error al inicializar whatsapp: ", e)
        }
    }

    disconnected(){

        this.client.on("disconnected",(reson)=> {
            try {
                console.log("se cerró sesión: ", reson);
                this.logout();
                this.client.initialize().catch(_ => _);
            } catch (e) {
                console.log('disconnected: ', e)
            }
        })

    }

    initialize(){
        this.client.initialize().catch(_ => _);
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