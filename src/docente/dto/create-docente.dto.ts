import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateDocenteDto {

    @IsNotEmpty({message:'TipoDocumento es requerido'})
    @IsString({message:'Nombres tienen que ser de tipo STRING'})
    @MaxLength(5, {message:'TipoDocumento tiene permitido como máximo 5 carácteres'})
    TipoDocumento:string;

    @IsNotEmpty({message:'Documento es requerido'})
    @MaxLength(11, {message:'Documento tiene permitido como máximo 11 carácteres'})
    Documento:string;

    @IsNotEmpty({message:'Nombres es requerido'})
    @IsString({message:'Nombres tienen que ser de tipo STRING'})
    @MaxLength(45, {message:'Nombres tiene permitido como máximo 45 carácteres'})
    Nombres:string;

    @IsNotEmpty({message:'ApellidoPaterno es requerido'})
    @IsString({message:'ApellidoPaterno tienen que ser de tipo STRING'})
    @MaxLength(45, {message:'ApellidoPaterno tiene permitido como máximo 45 carácteres'})
    ApellidoPaterno:string; 

    @IsNotEmpty({message:'ApellidoMaterno es requerido'})
    @IsString({message:'ApellidoMaterno tienen que ser de tipo STRING'})
    @MaxLength(45, {message:'ApellidoMaterno tiene permitido como máximo 45 carácteres'})
    ApellidoMaterno :string;

    @IsNotEmpty({message:'Celular es requerido'})
    @MaxLength(15, {message:'Celular tiene permitido como máximo 15 carácteres'})
    Celular:string;

    @IsNotEmpty({message:'Direccion es requerido'})
    @IsString({message:'Direccion tienen que ser de tipo STRING'})
    @MaxLength(100, {message:'Direccion tiene permitido como máximo 100 carácteres'})
    Direccion:string;

    @IsNotEmpty({message:'Email es requerido'})
    @IsString({message:'Email tienen que ser de tipo STRING'})
    @IsEmail()
    @MaxLength(50, {message:'Email tiene permitido como máximo 50 carácteres'})
    Email:string;

    @IsNotEmpty({message:'Code es requerido'})
    @IsString({message:'Code tienen que ser de tipo STRING'})
    @MaxLength(5, {message:'Code tiene permitido como máximo 5 carácteres'})
    Code:string;

    @IsNotEmpty({message:'CodePhone es requerido'})
    @IsString({message:'CodePhone tienen que ser de tipo STRING'})
    @MaxLength(10, {message:'CodePhone tiene permitido como máximo 5 carácteres'})
    CodePhone:string;

}