import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateEstadoGrupoDto {

    @IsNotEmpty({message:'EstadoGrupo es requerido'})
    @IsString({message:'EstadoGrupo tiene que ser de tipo STRING'})
    @MaxLength(40,{message:'EstadoGrupo tiene permitido como máximo 40 carácteres'})
    EstadoGrupo:string;

    @IsNotEmpty({message:'codeEstado es requerido'})
    @IsString({message:'codeEstado tiene que ser de tipo STRING'})
    @MaxLength(40,{message:'codeEstado tiene permitido como máximo 40 carácteres'})
    CodeEstado:string;

    @IsNotEmpty({message:'DescripcionEstadoGrupo es requerido'})
    @IsString({message:'DescripcionEstadoGrupo tiene que ser de tipo STRING'})
    @MaxLength(350,{message:'DescripcionEstadoGrupo tiene permitido como máximo 350 carácteres'})
    DescripcionEstadoGrupo:string;
}
