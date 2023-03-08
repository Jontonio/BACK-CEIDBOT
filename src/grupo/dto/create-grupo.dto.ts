import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { Curso } from "src/curso/entities/curso.entity";
import { Docente } from "src/docente/entities/docente.entity";
import { Horario } from "src/horario/entities/horario.entity";
import { TipoGrupo } from "../entities/tipo-grupo.entity";

export class CreateGrupoDto {

    @IsNotEmpty({message:'La FechaInicio no tiene que ser vacía'})
    @IsDate({message:'La FechaInicio tiene que ser de tipo Date'})
    FechaInicioGrupo:Date;

    @IsNotEmpty({message:'La FechaFin no tiene que ser vacía'})
    @IsDate({message:'La FechaFin tiene que ser de tipo Date'})
    FechaFinalGrupo:Date;
    
    @IsNotEmpty({message:'La DescGrupo no tiene que ser vacía'})
    @Length(0, 340,{message:'La DescGrupo tiene un logitud de 0-250 carácteres'})
    DescGrupo:string;
    
    @IsNotEmpty({message:'El MaximoEstudiantes no tiene que ser vacía'})
    @IsNumber()
    MaximoEstudiantes:number;

    @IsNotEmpty({message:'Es necesario el Id del docente dentro del objeto docente'})
    docente:Docente;

    @IsNotEmpty({message:'Es necesario el Id del curso dentro del objeto curso'})
    curso:Curso;

    @IsNotEmpty({message:'Es necesario el Id del horario dentro del objeto horario'})
    horario:Horario;

    @IsNotEmpty({message:'Es necesario el Id del tipoGrupo dentro del objeto tipoGrupo'})
    tipoGrupo:TipoGrupo;

    @IsNotEmpty({message:'La Modalidad no tiene que ser un campo vacio'})
    Modalidad:string;
}
