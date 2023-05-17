import { Person } from "src/interfaces/Person";
import { Usuario } from "../usuario/entities/usuario.entity";
import { Curso } from "src/curso/entities/curso.entity";
import { Docente } from "src/docente/entities/docente.entity";
import { Grupo } from "src/grupo/entities/grupo.entity";
import { TipoGrupo } from "src/grupo/entities/tipo-grupo.entity";
import { Horario } from "src/horario/entities/horario.entity";
import { Login } from "src/interfaces/Login";
import { DenominacionServicio } from "src/denominacion-servicio/entities/denominacion-servicio.entity";
import { Apoderado } from "src/apoderado/entities/apoderado.entity";
import { Estudiante } from "src/estudiante/entities/estudiante.entity";
import { Matricula } from "src/matricula/entities/matricula.entity";
import { Institucion } from "src/institucion/entities/institucion.entity";
import { EstudianteEnGrupo } from "src/estudiante-en-grupo/entities/estudiante-en-grupo.entity";
import { Nivel } from "src/nivel/entities/nivel.entity";
import { Pago } from "src/pago/entities/pago.entity";
import { Libro } from "src/libro/entities/libro.entity";
import { CategoriaPago } from "src/categoria-pago/entities/categoria-pago.entity";
import { EstadoGrupo } from "src/estado-grupo/entities/estado-grupo.entity";
import { TipoTramite } from "src/tipo-tramite/entities/tipo-tramite.entity";
import { MedioDePago } from "src/medio-de-pago/entities/medio-de-pago.entity";
import { Tramite } from "src/tramite/entities/tramite.entity";
import { Modulo } from "src/curso/entities/modulo.entity";
import { GrupoModulo } from "src/grupo/entities/grupoModulo.entity";

class HandleWhatsapp{
  constructor(public msg:string, public ok:boolean, public data:any){}
}

class HandleDialogFlow{
  constructor(public msg:string, public ok:boolean, public data:any){}
}

class HandleResetPassword{
  constructor(public msg:string, public ok:boolean,public data:any){}
}

class HandleTipoTramite{
  constructor(public msg:string, public ok:boolean,public data:TipoTramite | TipoTramite[], public count?:number){}
}

class HandleTramite{
  constructor(public msg:string, public ok:boolean,public data:Tramite | Tramite[], public count?:number){}
}

class HandleMedioDePago{
  constructor(public msg:string, public ok:boolean,public data:MedioDePago | MedioDePago[], public count?:number){}
}

class HandleLibro{
  constructor(public msg:string, public ok:boolean,public data:Libro | Libro[], public count?:number){}
}

class HandleEstadoGrupo{
  constructor(public msg:string, public ok:boolean,public data:EstadoGrupo | EstadoGrupo[], public count?:number){}
}

class HandleCategoriaPago{
  constructor(public msg:string, public ok:boolean,public data:CategoriaPago | CategoriaPago[], public count?:number){}
}
class HandlePago{
  constructor(public msg:string, public ok:boolean,public data:Pago | Pago[], public count?:number){}
}

class HandleEstudianteEnGrupo{
  constructor(public msg:string, public ok:boolean,public data:EstudianteEnGrupo | EstudianteEnGrupo[], public count?:number){}
}

class HandleEstudianteEnGrupoPago{
  constructor(public msg:string, public ok:boolean,public data:any, public count?:number){}
}

class HandleNivel{
  constructor(public msg:string, public ok:boolean, public data:Nivel | Nivel[], public count?:number){}
}

class HandleInstitucion{
  constructor(public msg:string, public ok:boolean,public data:Institucion | Institucion[], public count?:number){}
}

class HandleMatricula{
  constructor(public msg:string, public ok:boolean,public data:Matricula | Matricula[], public count?:number){}
}

class HandleEstudiante{
  constructor(public msg:string, public ok:boolean,public data:Estudiante | Estudiante[], public count?:number){}
}

class HandleApoderado{
  constructor(public msg:string, public ok:boolean,public data:Apoderado | Apoderado[], public count?:number){}
}

class HandleDenominServicio{
  constructor(public msg:string, public ok:boolean,public data:DenominacionServicio | DenominacionServicio[], public count?:number){}
}

class HandleCurso {
  constructor(public msg:string, public ok:boolean,public data:Curso | Curso[], public count?:number){}
}

class HandleModulo {
  constructor(public msg:string, public ok:boolean,public data:Modulo | Modulo[], public count?:number){}
}

class HandleDocente {
  constructor(public msg:string, public ok:boolean,public data:Docente | Docente[], public count?:number){}
}


class HandleGrupo {
  constructor(public msg:string, public ok:boolean,public data:Grupo | Grupo[] | TipoGrupo | TipoGrupo[], public count?:number){}

}
class HandleGrupoModulo {
  constructor(public msg:string, public ok:boolean,public data:GrupoModulo | GrupoModulo[], public count?:number){}
}

class HandleHorario {
  constructor(public msg:string, public ok:boolean,public data:Horario | Horario[], public count?:number){}
}

class HandleLogin {
  constructor(public msg:string, public ok:boolean, public token:string, public user:Login){}
}

class HandleLogout {
  constructor(public msg:string, public ok:boolean, public user:Login){}
}

export class HandleUsuario {
    constructor(public msg:string, public ok:boolean, public data:Usuario | Usuario[] | Person, public count?:number){}
}
    
export { 
    HandleLogin, 
    HandleLogout,
    HandleCurso, 
    HandleModulo,
    HandleDocente, 
    HandleGrupo, 
    HandleHorario,
    HandleDenominServicio,
    HandleMatricula,
    HandleEstudiante,
    HandleApoderado,
    HandleInstitucion,
    HandleEstudianteEnGrupo,
    HandleNivel,
    HandlePago,
    HandleLibro,
    HandleCategoriaPago,
    HandleEstadoGrupo,
    HandleResetPassword,
    HandleWhatsapp,
    HandleEstudianteEnGrupoPago,
    HandleTipoTramite,
    HandleMedioDePago,
    HandleTramite,
    HandleGrupoModulo,
    HandleDialogFlow
}

