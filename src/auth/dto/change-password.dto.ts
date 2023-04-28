import { IsAlphanumeric, IsNotEmpty, IsUUID, MaxLength, MinLength } from "class-validator";

export class RequestChangePasswordDto{

    @IsNotEmpty({message:'NewPassword es requerido'})
    @IsAlphanumeric()
    @MinLength(8, {message:'NewPassword tiene permitido como mínimo 8 carácteres'})
    @MaxLength(20, {message:'NewPassword tiene permitido como máximo 20 carácteres'})
    NewPassword:string;

    @IsAlphanumeric()
    @MinLength(8, {message:'RepeatPassword tiene permitido como mínimo 8 carácteres'})
    @MaxLength(20, {message:'RepeatPassword tiene permitido como máximo 20 carácteres'})
    @IsNotEmpty({message:'RepeatPassword es requerido'})
    RepeatPassword:string;

    @IsNotEmpty({ message:'Token es requerido' })
    @IsUUID("4")
    ResetPasswordToken:string;
} 