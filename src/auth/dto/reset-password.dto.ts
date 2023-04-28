import { IsEmail, IsNotEmpty } from "class-validator";

export class RequestResetPasswordDto{
    @IsEmail()
    @IsNotEmpty({message:'Email es requerido'})
    Email:string;
} 