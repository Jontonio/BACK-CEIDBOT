import { IsBoolean, IsNotEmpty } from "class-validator";
import { Curso } from "src/curso/entities/curso.entity";
import { DenominacionServicio } from "src/denominacion-servicio/entities/denominacion-servicio.entity";
import { Estudiante } from "src/estudiante/entities/estudiante.entity";
import { Institucion } from "src/institucion/entities/institucion.entity";

export class CreateMatriculaDto {

    @IsNotEmpty({message:'DeclaraJurada es requerido'})
    @IsBoolean({message:'DeclaraJurada tiene que ser de tipo BOOLEAN'})
    DeclaraJurada:boolean;

    @IsNotEmpty({message:'RequiTecnologico es requerido'})
    @IsBoolean({message:'RequiTecnologico tiene que ser de tipo BOOLEAN'})
    RequiTecnologico:boolean;

    @IsNotEmpty({message:'CarCompromiso es requerido'})
    @IsBoolean({message:'CarCompromiso tiene que ser de tipo BOOLEAN'})
    CarCompromiso:boolean;

    /** Ids de tablas relacionadas */
    @IsNotEmpty({message:'Es necesario el Id del Estudiante dentro del objeto estudiante'})
    estudiante:Estudiante;

    @IsNotEmpty({message:'Es necesario el Id de DenominacionServicio dentro del objeto denomiServicio'})
    denomiServicio:DenominacionServicio;

    @IsNotEmpty({message:'Es necesario el Id del Curso dentro del objeto curso'})
    curso:Curso;

    @IsNotEmpty({message:'Es necesario el Id de la institucion dentro del objeto Institucion'})
    institucion:Institucion;

}