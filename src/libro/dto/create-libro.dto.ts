import { IsNotEmpty, IsNumber, MaxLength } from "class-validator"
import { Curso } from "src/curso/entities/curso.entity";

export class CreateLibroDto {
    @IsNotEmpty({message:'TituloLibro es requerido'})
    @MaxLength(100, {message:'TituloLibro tiene permitido como máximo 100 carácteres'})
    TituloLibro:string;

    @IsNotEmpty({message:'DescripcionLibro es requerido'})
    @MaxLength(350, {message:'DescripcionLibro tiene permitido como máximo 350 carácteres'})
    DescripcionLibro:string;

    @IsNotEmpty({message:'CostoLibro es requerido'})
    @IsNumber()
    CostoLibro:number;

    @IsNotEmpty({message:'Es necesario el Id del Curso dentro del objeto curso'})
    curso:Curso;
}
