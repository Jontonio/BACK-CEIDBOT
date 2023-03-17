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

@Module({
  imports: [ 
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Curso, Docente, Usuario, Grupo, TipoGrupo, Horario]),
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
    UbigeoModule, DenominacionServicioModule, MatriculaModule, ApoderadoModule, EstudianteModule, InstitucionModule
  ],
  controllers: [AppController],
  providers: [AppService, 
              AppGateway, 
              CursoService,
              DocenteService,
              UsuarioService,
              GrupoService,
              HorarioService
            ]
})
export class AppModule {}
