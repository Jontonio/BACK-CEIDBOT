import { IsEmail, IsNotEmpty, IsNumber, IsString, Length, MaxLength } from "class-validator";
import { Rol } from "src/rol/entities/rol.entity";
export class CreateUsuarioDto {
    
    @IsNotEmpty({message:'DNI es requerido'})
    DNI:string;

    @IsNotEmpty({message:'Nombres es requerido'})
    @IsString({message:'Nombres tienen que ser de tipo STRING'})
    Nombres:string;

    @IsNotEmpty({message:'ApellidoPaterno es requerido'})
    @IsString({message:'ApellidoPaterno tienen que ser de tipo STRING'})
    ApellidoPaterno:string;

    @IsNotEmpty({message:'ApellidoMaterno es requerido'})
    @IsString({message:'ApellidoMaterno tienen que ser de tipo STRING'})
    ApellidoMaterno:string;

    @IsNotEmpty({message:'Celular es requerido'})
    Celular:string;

    @IsNotEmpty({message:'Email es requerido'})
    @IsEmail()
    Email:string;

    @IsNotEmpty({message:'Direccion es requerido'})
    @IsString({message:'Direccion tiene que ser de tipo STRING'})
    @MaxLength(100, {message:'Direccion tiene permitido como máximo 100 carácteres'})
    Direccion:string;

    @IsNotEmpty({message:'Code es requerido'})
    @IsString({message:'Code tienen que ser de tipo STRING'})
    Code:string;

    @IsNotEmpty({message:'CodePhone es requerido'})
    @IsString({message:'CodePhone tienen que ser de tipo STRING'})
    CodePhone:string;

    Password:string;

    @IsNotEmpty({message:'Id rol es requerido de tipo objeto Rol'})
    rol:Rol;
    
}
