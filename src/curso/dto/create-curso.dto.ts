import { IsNotEmpty, IsNumber, IsString, IsUrl, Length } from "class-validator"

export class CreateCursoDto {

    @IsString()
    @IsNotEmpty()
    NombrePais:string

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    UrlBandera:string

    @IsNumber()
    @IsNotEmpty()
    NumModulos:number;

    @IsString()
    @IsNotEmpty()
    NombreCurso:string

    @IsString()
    @IsNotEmpty()
    NivelCurso:string

    @IsString()
    @IsNotEmpty()
    @Length(1, 355)
    DescripcionCurso:string


}
