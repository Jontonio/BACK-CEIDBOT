import { SubscribeMessage, 
         WebSocketGateway,
         WebSocketServer, 
         OnGatewayInit, 
         MessageBody} from '@nestjs/websockets';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets/interfaces';
import { Socket, Server } from 'socket.io';
import { CursoService } from 'src/curso/curso.service';
import { DocenteService } from 'src/docente/docente.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { GrupoService } from 'src/grupo/grupo.service';
import { HorarioService } from 'src/horario/horario.service';
import { MatriculaService } from 'src/matricula/matricula.service';
import { EstudianteEnGrupoService } from 'src/estudiante-en-grupo/estudiante-en-grupo.service';
import * as moment from 'moment';
import { TramiteService } from 'src/tramite/tramite.service';

moment.locale('es');

@WebSocketGateway({
  cors:{ origin:'*' }
})

export class AppGateway implements OnGatewayInit, 
                                   OnGatewayConnection,
                                   OnGatewayDisconnect{
  
  @WebSocketServer() server:Server;
  
  
  constructor(private readonly _curso:CursoService,
              private readonly _docente:DocenteService,
              private readonly _grupo:GrupoService,
              private readonly _estudianteEngrupo:EstudianteEnGrupoService,
              private readonly _horario:HorarioService,
              private readonly _tramite:TramiteService,
              private readonly _matri:MatriculaService,
              private readonly _usuario:UsuarioService){}

  afterInit(server: Server) {

    this.server = server;

  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }
  
  handleConnection(client: Socket) {
    console.log(`Connected ${client.id}`);
    client.emit('welcome-ceidbot',{ data:'', ok:true, msg:'Bienvenido al sistema CEIDBOT' } );
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client:Socket){
    client.emit('sendMessage', { msg:"Hola mundo from NESTJS" });
  }

  @SubscribeMessage('updated_list_curso')
  async handleCursos(@MessageBody() data: any){
    const query = data? { limit: data.limit, offset: data.offset }:{ limit: 5, offset: 0 }
    const res = await this._curso.findAllCursos( query )
    this.server.emit('list_cursos', res );
  }

  @SubscribeMessage('updated_list_estudiante_grupo')
  async handleEstudianteGrupo(@MessageBody() data: any){
    const query = data? { limit: data.limit, offset: data.offset }:{ limit: 5, offset: 0 };
    const res = await this._estudianteEngrupo.findByIdGrupo(data.Id, query);
    console.log(res)
    this.server.emit('list_estudian_en_grupo', res );
  }

  @SubscribeMessage('updated_list_tramites')
  async handleTramites(@MessageBody() data: any){
    const query = data? { limit: data.limit, offset: data.offset }:{ limit: 5, offset: 0 };
    const res = await this._tramite.findAll(query);
    this.server.emit('list_tramites', res );
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
  async handleGrupo(@MessageBody() data: any){
    const query = data? { limit: data.limit, offset: data.offset }:{ limit: 5, offset: 0 };
    const res =  await this._grupo.findAllGrupos( query );
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
  
}
