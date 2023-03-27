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

class HandleEstudianteEnGrupo{
  constructor(public msg:string, public ok:boolean,public data:EstudianteEnGrupo | EstudianteEnGrupo[], public count?:number){}
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

class HandleDocente {
  constructor(public msg:string, public ok:boolean,public data:Docente | Docente[], public count?:number){}
}


class HandleGrupo {
  constructor(public msg:string, public ok:boolean,public data:Grupo | Grupo[] | TipoGrupo | TipoGrupo[], public count?:number){}
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
    HandleDocente, 
    HandleGrupo, 
    HandleHorario,
    HandleDenominServicio,
    HandleMatricula,
    HandleEstudiante,
    HandleApoderado,
    HandleInstitucion,
    HandleEstudianteEnGrupo
}

