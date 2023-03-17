import { IsNotEmpty, IsOptional, MaxLength } from "class-validator";

export class CreateInstitucionDto {

    @IsNotEmpty({message:'NombreInstitucion es requerida'})
    @MaxLength(60, {message:'NombreInstitucion tiene permitido como máximo 60 carácteres'})
    NombreInstitucion:string;
    
    @IsOptional()
    @MaxLength(60, {message:'NombreInstitucion tiene permitido como máximo 60 carácteres'})
    EscuelaProfe:string;
}
