import { IsNotEmpty, IsString } from "class-validator";

export class CreateRolDto {

    @IsString()
    @IsNotEmpty()
    TipoRol:string;
}
