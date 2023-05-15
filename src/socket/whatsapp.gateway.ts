import { WebSocketGateway, 
         WebSocketServer} from '@nestjs/websockets';
import { InternalServerErrorException } from '@nestjs/common'
import { whatsApp } from 'src/helpers/whatsapp';
import { Socket, Server } from 'socket.io';
import { Client, LocalAuth } from 'whatsapp-web.js';
import { CursoService } from 'src/curso/curso.service';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { PersonaComunicado } from 'src/class/PersonaComunicado';
import * as moment from "moment";
import { BotDto } from 'src/bot/dto/bot.dto';
moment.locale('es');

@WebSocketGateway()
export class WhatsappGateway {
  
  client: Client;
  whatsapp:whatsApp;
  @WebSocketServer() server:Server;

  constructor(private readonly dataSource:DataSource, 
              private readonly _curso:CursoService ){}

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

  async sendMessageWhatsapp({ Numero, Message }:BotDto ){
    try {
      return await this.client.sendMessage(Numero, Message);
    } catch (e) {
      throw new InternalServerErrorException("ERROR AL ENVIAR MENSAJE")
    }
  }

  /** enviar comunicado un día antes, el mismo dia, un día despues de legue la fecha programada de los módulos*/
  @Cron('0 */1 * * * *', { timeZone:'America/Lima' })
  // @Cron('0 */1 * * * *', { timeZone:'America/Lima' })
  async sendMessageEstudiante(){
    try {
      if(this.whatsapp.isAuth){
        const lista:PersonaComunicado[] = await this.getEstudiantesSinPagoMensualidad();
        if(lista.length!=0){
          for(const estudiante of lista){
            const {Celular, CodePhone, Nombres, NombreCurso, FechaPago, Nivel} = estudiante;
            const Numero = `${CodePhone}${Celular}`.replace('+','').concat('@c.us').trim();
            const Message = `Hola ${Nombres}, \n Te escribimos desde para recordarte que tienes un pago pendiente por el módulo del curso de ${NombreCurso} ${Nivel}, cuya fecha límite de pago es el día ${moment(FechaPago).format('YYYY-MM-DD')}.
            Por favor, asegúrate de realizar el pago a tiempo para evitar inconvenientes y no perder acceso al contenido del curso. Si ya realizaste el pago, por favor ignora este mensaje.
            Quedamos atentos a cualquier duda o consulta que tengas.\n Saludos cordiales CEIBOT`;
            const whatsAppDto:BotDto = {Numero, Nombres, Message};
            await this.sendMessageWhatsapp( whatsAppDto );
            console.log("Mensaje enviado a "+Nombres)
          }
        }
      }
    } catch (e) {
      throw new InternalServerErrorException("SEND MESSAGE ESTUDIANTE")
    }
  }

  async getEstudiantesSinPagoMensualidad(){
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const listaEstudiantes = await queryRunner.query(`
      SELECT estudiante.TipoDocumento, 
             estudiante.Documento, 
             estudiante.Nombres, 
             estudiante.ApellidoPaterno, 
             estudiante.ApellidoMaterno, 
             estudiante.CodePhone,
             estudiante.Celular,
             FechaPago,
             curso.NombreCurso,
             nivel.Nivel
      FROM estudiante
      INNER JOIN estudiante_en_grupo ON estudiante.Id = estudiante_en_grupo.estudianteId
      INNER JOIN grupo ON estudiante_en_grupo.grupoId = grupo.Id
      INNER JOIN curso ON grupo.cursoId = curso.Id
      INNER JOIN nivel on nivel.Id = curso.nivelId
      INNER JOIN grupo as reg_grupo on curso.Id = grupo.cursoId
      INNER JOIN grupo_modulo ON grupo.Id = grupo_modulo.grupoId
      WHERE grupo.Estado != false AND
            grupo.estadoGrupoId != 3 AND 
            estudiante_en_grupo.Estado != false  AND 
            grupo_modulo.FechaPago >= DATE_SUB(CURDATE(), INTERVAL 1 DAY) AND
            grupo_modulo.FechaPago <= DATE_ADD(CURDATE(), INTERVAL 1 DAY)
      AND NOT EXISTS (
        SELECT * FROM pago
        WHERE pago.grupoModuloId = grupo_modulo.Id AND pago.Verificado IS NOT NULL AND pago.CodigoVoucher IS NOT NULL AND pago.CodigoVoucher <> '' AND (pago.Estado IS NULL OR pago.Estado != 0)
        AND pago.estudianteEnGrupoId = estudiante_en_grupo.Id AND pago.grupoModuloId = grupo_modulo.Id
      );
      `);
      await queryRunner.commitTransaction();
      return listaEstudiantes;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
      console.log("ERROR GET LISTA ESTUDIANTES SIN MENSUALIDAD")
    } finally {
      await queryRunner.release();
    }
  }
  
}
