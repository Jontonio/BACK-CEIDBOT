import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator"

export class CreateCursoDto {

    @IsNotEmpty({message:'NombrePais es requerido'})
    @IsString({message:'NombrePais tiene que ser de tipo STRING'})
    @MaxLength(40,{message:'NombrePais tiene permitido como máximo 40 carácteres'})
    NombrePais:string

    @IsNotEmpty({message:'UrlBandera es requerido'})
    @IsString({message:'UrlBandera tiene que ser de tipo STRING'})
    @MaxLength(50,{message:'UrlBandera tiene permitido como máximo 50 carácteres'})
    UrlBandera:string

    @IsNotEmpty({message:'NumModulos es requerido'})
    @IsNumber()
    NumModulos:number;

    @IsNotEmpty({message:'NombreCurso es requerido'})
    @IsString({message:'NombreCurso tiene que ser de tipo STRING'})
    @MaxLength(45,{message:'NombreCurso tiene permitido como máximo 45 carácteres'})
    NombreCurso:string

    @IsNotEmpty({message:'NivelCurso es requerido'})
    @IsString({message:'NivelCurso tiene que ser de tipo STRING'})
    @MaxLength(20,{message:'NivelCurso tiene permitido como máximo 20 carácteres'})
    NivelCurso:string

    @IsNotEmpty({message:'DescripcionCurso es requerido'})
    @IsString({message:'DescripcionCurso tiene que ser de tipo STRING'})
    @MaxLength(350,{message:'DescripcionCurso tiene permitido como máximo 350 carácteres'})
    DescripcionCurso:string
}
