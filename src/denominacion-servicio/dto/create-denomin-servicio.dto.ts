import { IsNotEmpty, IsNumber, MaxLength } from "class-validator";

export class CreateDenominServicioDto {
    
    @IsNotEmpty({message:'Descripcion es requerido'})
    @MaxLength(350, {message:'Descripcion tiene permitido como máximo 350 carácteres'})
    Descripcion:string;
    
    @IsNotEmpty({message:'MontoPension es requerido'})
    @IsNumber()
    MontoPension:number;

    @IsNotEmpty({message:'MontoMatricula es requerido'})
    @IsNumber()
    MontoMatricula:number;
}
