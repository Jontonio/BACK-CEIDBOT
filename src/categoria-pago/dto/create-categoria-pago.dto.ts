import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateCategoriaPagoDto {

    @IsNotEmpty({message:'TipoCategoriaPago es requerido'})
    @MaxLength(40, {message:'TipoCategoriaPago tiene permitido como máximo 40 carácteres'})
    TipoCategoriaPago:string;
}
