import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateMedioDePagoDto {
    @IsNotEmpty({message:'MedioDePago es requerido'})
    @MaxLength(45, {message:'MedioDePago tiene permitido como máximo 100 carácteres'})
    MedioDePago:string;
}
