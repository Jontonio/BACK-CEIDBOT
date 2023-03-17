import { Docente } from "src/docente/entities/docente.entity";
import { Usuario } from "src/usuario/entities/usuario.entity";


export const handleSuccesHttp = (msg:string, 
                                 ok:true, 
                                 data:Docente|Docente[]|Usuario|null,
                                 count?:number) => {
    return {msg, ok, data:data, count};
}