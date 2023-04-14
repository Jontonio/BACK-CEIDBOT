import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateApoderadoDto {

    @IsNotEmpty({message:'TipoDocumento es requerido'})
    @IsString({message:'Nombres tienen que ser de tipo STRING'})
    @MaxLength(5, {message:'TipoDocumento tiene permitido como máximo 5 carácteres'})
    TipoDocumento:string;

    @IsNotEmpty({message:'Documento es requerido'})
    @MaxLength(11, {message:'Documento tiene permitido como máximo 11 carácteres'})
    @MinLength(8, { message:'Documento tiene permitido como mínimo 8 carácteres'})
    Documento:string;

    @IsNotEmpty({message:'Nombres es requerido'})
    @IsString({message:'Nombres tienen que ser de tipo STRING'})
    @MaxLength(45, {message:'Nombres tiene permitido como máximo 45 carácteres'})
    NomApoderado:string;

    @IsNotEmpty({message:'ApellidoPaterno es requerido'})
    @IsString({message:'ApellidoPaterno tienen que ser de tipo STRING'})
    @MaxLength(45, {message:'ApellidoPaterno tiene permitido como máximo 45 carácteres'})
    ApellidoPApoderado:string;

    @IsNotEmpty({message:'ApellidoMaterno es requerido'})
    @IsString({message:'ApellidoMaterno tienen que ser de tipo STRING'})
    @MaxLength(45, {message:'ApellidoMaterno tiene permitido como máximo 45 carácteres'})
    ApellidoMApoderado:string;

    @IsNotEmpty({message:'Celular es requerido'})
    @MaxLength(9, {message:'Celular tiene permitido como máximo 9 carácteres'})
    CelApoderado:string;

    @IsNotEmpty({message:'Code es requerido'})
    @IsString({message:'Code tienen que ser de tipo STRING'})
    @MaxLength(5, {message:'Code tiene permitido como máximo 5 carácteres'})
    Code:string;

    @IsNotEmpty({message:'CodePhone es requerido'})
    @IsString({message:'CodePhone tienen que ser de tipo STRING'})
    @MaxLength(10, {message:'CodePhone tiene permitido como máximo 5 carácteres'})
    CodePhone:string;

}
