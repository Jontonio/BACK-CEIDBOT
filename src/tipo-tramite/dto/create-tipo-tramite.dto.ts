import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator"

export class CreateTipoTramiteDto {

    @IsNotEmpty({message:'DerechoPagoTramite es requerido'})
    @IsNumber()
    DerechoPagoTramite:number;

    @IsNotEmpty({message:'TipoTramite es requerido'})
    @IsString({message:'TipoTramite tienen que ser de tipo STRING'})
    @MaxLength(45,{message:'DescripcionTramite tiene permitido como máximo 350 carácteres'})
    TipoTramite:string;

    @IsNotEmpty({message:'DescripcionTramite es requerido'})
    @MaxLength(350,{message:'DescripcionTramite tiene permitido como máximo 350 carácteres'})
    DescripcionTramite:string;
}
