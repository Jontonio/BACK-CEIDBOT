import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    
    @IsEmail()
    @IsNotEmpty({message:'Email es requerido'})
    Email:string;

    @IsNotEmpty({message:'Password es requerido'})
    Password:string;
}
