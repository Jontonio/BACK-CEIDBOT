import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RequestEstudianteDto{
    @IsNotEmpty({message:'TipoDocumento es requerido'})
    @IsString({message:'Nombres tienen que ser de tipo STRING'})
    @MaxLength(5, {message:'TipoDocumento tiene permitido como máximo 5 carácteres'})
    TipoDocumento:string;

    @IsNotEmpty({message:'Documento es requerido'})
    @MaxLength(12, {message:'Documento tiene permitido como máximo 11 carácteres'})
    @MinLength(8, { message:'Documento tiene permitido como mínimo 8 carácteres'})
    Documento:string;

}