import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateNivelDto {
    @IsNotEmpty({ message:'Nivel es requerido' })
    @IsString({ message:'Nivel tienen que ser de tipo STRING' })
    @MaxLength(15,{ message:'Nivel tiene permitido como máximo 15 carácteres' })
    Nivel:string;
}
