import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class EmailDocEstudianteDto {

    @IsNotEmpty({message:'Documento es requerido'})
    @MaxLength(12, {message:'Documento tiene permitido como máximo 11 carácteres'})
    @MinLength(8, { message:'Documento tiene permitido como mínimo 8 carácteres'})
    Documento:string;

    @IsNotEmpty({message:'Email es requerido'})
    @IsEmail()
    @MaxLength(50, {message:'Email tiene permitido como 40 máximo carácteres'})
    Email:string;

}
