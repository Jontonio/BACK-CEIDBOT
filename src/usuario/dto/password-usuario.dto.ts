import { MaxLength, MinLength, IsNotEmpty } from "class-validator";
export class PasswordUsuarioDto {
    
    @IsNotEmpty({message:'CurrentPassword es requerido'})
    @MaxLength(20, {message:'CurrentPassword tiene que ser máximo 15 carácteres'})
    CurrentPassword:string;
    
    @IsNotEmpty({message:'NewPassword es requerido'})
    @MinLength(8, {message:'NewPassword tiene que ser mínimo 8 carácteres'})
    @MaxLength(20, {message:'NewPassword tiene que ser máximo 15 carácteres'})
    NewPassword:string;
    
    @IsNotEmpty({message:'RepeatPassword es requerido'})
    @MinLength(8, {message:'RepeatPassword tiene que ser mínimo 8 carácteres'})
    @MaxLength(20, {message:'RepeatPassword tiene que ser máximo 15 carácteres'})
    RepeatPassword:string;

}
