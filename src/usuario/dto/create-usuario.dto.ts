import { IsEmail, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";
import { Rol } from "src/rol/entities/rol.entity";
export class CreateUsuarioDto {
    
    @IsNumber()
    @IsNotEmpty()
    DNI:number;

    @IsString()
    @IsNotEmpty()
    Nombres:string;

    @IsString()
    @IsNotEmpty()
    ApellidoPaterno:string;

    @IsString()
    @IsNotEmpty()
    ApellidoMaterno:string;

    @IsNotEmpty()
    @IsNumber()
    Celular:number;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    Email:string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 99)
    Direccion:string;

    @IsString()
    @IsNotEmpty()
    Code:string;

    @IsString()
    @IsNotEmpty()
    CodePhone:string;

    Password:string;

    @IsNotEmpty()
    rol:Rol;
    
}
