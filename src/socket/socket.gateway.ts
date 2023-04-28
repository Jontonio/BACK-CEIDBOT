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
import { GrupoService } from 'src/grupo/grupo.service';
import { HorarioService } from 'src/horario/horario.service';
import { MatriculaService } from 'src/matricula/matricula.service';
import { whatsApp } from 'src/helpers/whatsapp';

moment.locale('es');

@WebSocketGateway({
  cors:{ origin:'*' }
})
export class AppGateway implements OnGatewayInit, 
                                   OnGatewayConnection,
                                   OnGatewayDisconnect{
  client: Client;
  @WebSocketServer() server:Server;
  whatsapp:whatsApp;
  
  constructor(private readonly _curso:CursoService,
              private readonly _docente:DocenteService,
              private readonly _grupo:GrupoService,
              private readonly _horario:HorarioService,
              private readonly _matri:MatriculaService,
              private readonly _usuario:UsuarioService){}

  afterInit(server: Server) {

    this.server = server;

    this.client = new Client({ puppeteer: { headless: true,args: ['--no-sandbox'] },
            authStrategy: new LocalAuth({ dataPath:'auth-whatsapp' }),
    });

    this.whatsapp = new whatsApp(this.client, this.server, this._curso);
    
    this.whatsapp.start();
    
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    //Do stuffs
  }
  
  handleConnection(client: Socket) {
    console.log(`Connected ${client.id}`);
    /** Emit welcome socket */
    this.whatsapp.statusWhatsapp();
    client.emit('welcome-ceidbot',{ data:'', ok:true, msg:'Bienvenido al sistema CEIDBOT' } );
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client:Socket){
    client.emit('sendMessage', { msg:"Hola mundo from NESTJS" });
  }

  @SubscribeMessage('updated_list_curso')
  async handleCursos(){
    const res = await this._curso.findAll({limit:5, offset:0})
    this.server.emit('list_cursos', res );
  }

  @SubscribeMessage('updated_list_usuario')
  async handleUsuario(){
    const res =  await this._usuario.findAll({ limit:5, offset:0 });
    this.server.emit('list_usuarios', res );
  }

  @SubscribeMessage('updated_list_docente')
  async handleDocente(){
    const res =  await this._docente.findAll({ limit:5, offset:0 });
    this.server.emit('list_docentes', res );
  }

  @SubscribeMessage('updated_list_grupo')
  async handleGrupo(){
    const res =  await this._grupo.findAllGrupos({ limit:5, offset:0 });
    this.server.emit('list_grupos', res );
  }

  @SubscribeMessage('updated_list_nombre_grupo')
  async handleTNombreGrupo(){
    const res =  await this._grupo.findTipoGrupos();
    this.server.emit('list_tNombre_grupos', res );
  }

  @SubscribeMessage('updated_list_horario')
  async handleListHorario(){
    const res =  await this._horario.findListHorarios();
    this.server.emit('list_horarios', res );
  }

  @SubscribeMessage('updated_list_matriculados')
  async handleListMatriculados(){
    const res =  await this._matri.findAll({ limit:5, offset:0 });
    this.server.emit('list_matriculados', res );
  }

  @Cron('45 12 * * *')
  sendAutoMessage(){
    sendPaymentGirlFriend(this.client);
  }

  

}
