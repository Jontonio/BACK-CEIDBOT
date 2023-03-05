import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateDocenteDto {

    @IsString()
    @IsNotEmpty()
    TipoDocumento:string;

    @IsNumber()
    @IsNotEmpty()
    Documento:number;

    @IsString()
    @IsNotEmpty()
    Nombres:string;

    @IsString()
    @IsNotEmpty()
    ApellidoPaterno:string; 

    @IsString()
    @IsNotEmpty()
    ApellidoMaterno :string;

    @IsNumber()
    @IsNotEmpty()
    Celular:number;

    @IsString()
    @IsNotEmpty()
    Direccion:string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    Email:string;

    @IsString()
    @IsNotEmpty()
    Code:string;

    @IsString()
    @IsNotEmpty()
    CodePhone:string;

}