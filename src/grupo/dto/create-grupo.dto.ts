import { IsDate, IsNotEmpty, IsNumber, MaxLength } from "class-validator";
import { Curso } from "src/curso/entities/curso.entity";
import { Docente } from "src/docente/entities/docente.entity";
import { Horario } from "src/horario/entities/horario.entity";
import { TipoGrupo } from "../entities/tipo-grupo.entity";

export class CreateGrupoDto {

    @IsNotEmpty({message:'FechaInicio es requerido'})
    @IsDate({message:'FechaInicio tienen que ser de tipo Date'})
    FechaInicioGrupo:Date;

    @IsNotEmpty({message:'FechaFin es requerido'})
    @IsDate({message:'La FechaFin tiene que ser de tipo Date'})
    FechaFinalGrupo:Date;
    
    @IsNotEmpty({message:'DescGrupo es requerido'})
    @MaxLength(350, {message:'DescGrupo tiene permitido como máximo 350 carácteres'})
    DescGrupo:string;
    
    @IsNotEmpty({message:'MaximoEstudiantes es requerido'})
    @IsNumber()
    MaximoEstudiantes:number;

    @IsNotEmpty({message:'Modalidad es requerido'})
    @MaxLength(15, {message:'Modalidad tiene permitido como máximo 15 carácteres'})
    Modalidad:string;

    /** Ids de tablas relacionadas */
    @IsNotEmpty({message:'Es necesario el Id del docente dentro del objeto docente'})
    docente:Docente;

    @IsNotEmpty({message:'Es necesario el Id del curso dentro del objeto curso'})
    curso:Curso;

    @IsNotEmpty({message:'Es necesario el Id del horario dentro del objeto horario'})
    horario:Horario;

    @IsNotEmpty({message:'Es necesario el Id del tipoGrupo dentro del objeto tipoGrupo'})
    tipoGrupo:TipoGrupo;

}
