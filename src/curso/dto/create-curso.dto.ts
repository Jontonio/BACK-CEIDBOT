import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator"
import { Nivel } from "src/nivel/entities/nivel.entity";
import { Modulo } from "../entities/modulo.entity";

export class CreateCursoDto {

    @IsNotEmpty({message:'NombrePais es requerido'})
    @IsString({message:'NombrePais tiene que ser de tipo STRING'})
    @MaxLength(40,{message:'NombrePais tiene permitido como máximo 40 carácteres'})
    NombrePais:string

    @IsNotEmpty({message:'UrlBandera es requerido'})
    @IsString({message:'UrlBandera tiene que ser de tipo STRING'})
    @MaxLength(50,{message:'UrlBandera tiene permitido como máximo 50 carácteres'})
    UrlBandera:string

    @IsNotEmpty({message:'NombreCurso es requerido'})
    @IsString({message:'NombreCurso tiene que ser de tipo STRING'})
    @MaxLength(45,{message:'NombreCurso tiene permitido como máximo 45 carácteres'})
    NombreCurso:string

    @IsNotEmpty({message:'Es necesario el Id del Nivel dentro del objeto nivel'})
    nivel:Nivel;

    @IsNotEmpty({message:'DescripcionCurso es requerido'})
    @IsString({message:'DescripcionCurso tiene que ser de tipo STRING'})
    @MaxLength(350,{message:'DescripcionCurso tiene permitido como máximo 350 carácteres'})
    DescripcionCurso:string

    @IsOptional()
    LinkRequisitos:string

    @IsOptional()
    PrecioExamSuficiencia:number;

    @IsNotEmpty({message:'modulo es requerido'})
    modulo:Modulo;
}
