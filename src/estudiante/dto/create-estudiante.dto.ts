import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Apoderado } from "src/apoderado/entities/apoderado.entity";
import { Departamento } from "src/ubigeo/entities/departamento.entity";
import { Distrito } from "src/ubigeo/entities/distrito.entity";
import { Provincia } from "src/ubigeo/entities/provincia.entity";

export class CreateEstudianteDto {

    @IsNotEmpty({message:'DNI es requerido'})
    @MaxLength(8, {message:'DNI tiene permitido como máximo 8 carácteres'})
    @MinLength(8, {message:'DNI tiene permitido como mínimo 8 carácteres'})
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

    @IsNotEmpty({message:'Sexo es requerido'})
    @IsString({message:'Sexo tienen que ser de tipo STRING'})
    @MaxLength(10, {message:'Sexo tiene permitido como máximo 10 carácteres'})
    Sexo:string;

    @IsNotEmpty({message:'FechaNacimiento es requerido'})
    @IsDate({message:'FechaNacimiento tienen que ser de tipo fecha'})
    FechaNacimiento:Date;

    @IsNotEmpty({message:'Direccion es requerido'})
    @MaxLength(100, {message:'Direccion tiene permitido 100 carácteres'})
    Direccion:string;

    @IsNotEmpty({message:'Email es requerido'})
    @IsEmail()
    @MaxLength(50, {message:'Email tiene permitido como 40 máximo carácteres'})
    Email:string;

    @IsNotEmpty({message:'EsMayor es requerido'})
    @IsBoolean({message:'EsMayor tiene que ser boolean'})
    EsMayor:boolean;
    
    @IsOptional()
    apoderado:Apoderado;

    @IsNotEmpty({message:'Id departamento es requerido de tipo objeto Departamento'})
    departamento:Departamento;

    @IsNotEmpty({message:'Id provincia es requerido de tipo objeto Provincia'})
    provincia:Provincia;

    @IsNotEmpty({message:'Id distrito es requerido de tipo objeto Distrito'})
    distrito:Distrito;
}
