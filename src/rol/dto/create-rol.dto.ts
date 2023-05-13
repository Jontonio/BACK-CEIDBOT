import { IsNotEmpty, IsString } from "class-validator";

export class CreateRolDto {
    @IsNotEmpty({message:'TipoRol es requerido'})
    @IsString({message:'TipoRol tienen que ser de tipo STRING'})
    TipoRol:string;
}
