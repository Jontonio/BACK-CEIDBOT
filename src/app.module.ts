import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AppGateway } from './socket/socket.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RolModule } from './rol/rol.module';
import { DocenteModule } from './docente/docente.module';
import { CursoModule } from './curso/curso.module';
import { CursoService } from './curso/curso.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './curso/entities/curso.entity';
import { Docente } from './docente/entities/docente.entity';
import { DocenteService } from './docente/docente.service';
import { Usuario } from './usuario/entities/usuario.entity';
import { UsuarioService } from './usuario/usuario.service';
import { HorarioModule } from './horario/horario.module';
import { GrupoModule } from './grupo/grupo.module';
import { UbigeoModule } from './ubigeo/ubigeo.module';
import { GrupoService } from './grupo/grupo.service';
import { Grupo } from './grupo/entities/grupo.entity';
import { TipoGrupo } from './grupo/entities/tipo-grupo.entity';
import { HorarioService } from './horario/horario.service';
import { Horario } from './horario/entities/horario.entity';
import { DenominacionServicioModule } from './denominacion-servicio/denominacion-servicio.module';
import { MatriculaModule } from './matricula/matricula.module';
import { ApoderadoModule } from './apoderado/apoderado.module';
import { EstudianteModule } from './estudiante/estudiante.module';
import { InstitucionModule } from './institucion/institucion.module';
import { Matricula } from './matricula/entities/matricula.entity';
import { MatriculaService } from './matricula/matricula.service';
import { Apoderado } from './apoderado/entities/apoderado.entity';
import { DenominacionServicioService } from './denominacion-servicio/denominacion-servicio.service';
import { Estudiante } from './estudiante/entities/estudiante.entity';
import { Institucion } from './institucion/entities/institucion.entity';
import { EstudianteService } from './estudiante/estudiante.service';
import { DenominacionServicio } from './denominacion-servicio/entities/denominacion-servicio.entity';
import { ConfigModule } from '@nestjs/config';
import { ApoderadoService } from './apoderado/apoderado.service';
import { InstitucionService } from './institucion/institucion.service';
import { EstudianteEnGrupoModule } from './estudiante-en-grupo/estudiante-en-grupo.module';
import { NivelModule } from './nivel/nivel.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PagoModule } from './pago/pago.module';
import { LibroModule } from './libro/libro.module';
import { CategoriaPagoModule } from './categoria-pago/categoria-pago.module';
import { EstadoGrupoModule } from './estado-grupo/estado-grupo.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { config } from 'dotenv';
import { WhatsappGateway } from './socket/whatsapp.gateway';
import { WhatsAppService } from './whats-app/whats-app.service';
import { WhatsAppController } from './whats-app/whats-app.controller';
import { EstudianteEnGrupoService } from './estudiante-en-grupo/estudiante-en-grupo.service';
import { EstudianteEnGrupo } from './estudiante-en-grupo/entities/estudiante-en-grupo.entity';
import { PagoService } from './pago/pago.service';
import { Pago } from './pago/entities/pago.entity';
import { TipoTramiteModule } from './tipo-tramite/tipo-tramite.module';
import { TramiteModule } from './tramite/tramite.module';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      envFilePath:(process.env.NODE_ENV === 'production')?'.production.env':'.env',
      load:[config],
      isGlobal:true
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: 587,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      template: {
        dir: join(__dirname, 'emails'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
      }),
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Curso, 
                              Docente, 
                              Usuario, 
                              Grupo, 
                              TipoGrupo, 
                              Horario, 
                              Matricula,
                              Apoderado,
                              Estudiante,
                              EstudianteEnGrupo,
                              Pago,
                              Institucion,
                              DenominacionServicio]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'),
      exclude:['/api*']
    }),
    DatabaseModule, 
    UsuarioModule,
    AuthModule, 
    ReportsModule, 
    RolModule, 
    DocenteModule, 
    CursoModule, 
    HorarioModule, 
    GrupoModule, 
    UbigeoModule, 
    MatriculaModule, 
    ApoderadoModule,
    EstudianteModule,
    DenominacionServicioModule,
    InstitucionModule,
    EstudianteEnGrupoModule,
    NivelModule,
    PagoModule,
    LibroModule,
    CategoriaPagoModule,
    EstadoGrupoModule,
    TipoTramiteModule,
    TramiteModule
  ],
  controllers: [ AppController, WhatsAppController ],
  providers: [AppService, 
              AppGateway, 
              CursoService,
              DocenteService,
              UsuarioService,
              GrupoService,
              HorarioService,
              MatriculaService,
              ApoderadoService,
              EstudianteService,
              EstudianteEnGrupoService,
              InstitucionService,
              PagoService,
              DenominacionServicioService,
              WhatsappGateway,
              WhatsAppService
            ]
})
export class AppModule {}
