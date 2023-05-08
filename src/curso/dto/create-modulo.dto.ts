import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator"

export class CreateModuloDto {
    
    @IsNotEmpty({message:'Modulo es requerido'})
    @IsNumber()
    Modulo:number;
    
    @IsOptional()
    @IsString({message:'DescripcionModulo tiene que ser de tipo STRING'})
    @MaxLength(350,{message:'DescripcionModulo tiene permitido como máximo 350 carácteres'})
    DescripcionModulo:string;

}
