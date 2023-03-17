import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateApoderadoDto {

    @IsNotEmpty({message:'DNI es requerido'})
    @MinLength(8, {message:'DNI tiene permitido como mínimo 8 carácteres'})
    @MaxLength(8, {message:'DNI tiene permitido como máximo 8 carácteres'})
    DNI:string;

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
    ApellidoMaterno:string;

    @IsNotEmpty({message:'Celular es requerido'})
    @MaxLength(9, {message:'Celular tiene permitido como máximo 9 carácteres'})
    Celular:string;

}
