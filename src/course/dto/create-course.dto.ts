import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator"

export class CreateCourseDto {

    @IsString()
    @IsNotEmpty()
    NombrePais:string

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    UrlBandera:string

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
