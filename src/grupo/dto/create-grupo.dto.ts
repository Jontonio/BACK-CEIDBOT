import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateGrupoDto {

    @IsNotEmpty()
    @IsString()
    @Length(1, 20)
    NombreGrupo:string;

    @IsOptional()
    @IsString()
    @Length(0, 99)
    DescGrupo:string;
}
