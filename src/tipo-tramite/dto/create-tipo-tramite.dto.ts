import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateTipoTramiteDto {

    @IsNotEmpty({message:'DerechoPagoTramite es requerido'})
    @IsNumber()
    DerechoPagoTramite:number;

    @IsNotEmpty({message:'TipoTramite es requerido'})
    @IsString({message:'TipoTramite tienen que ser de tipo STRING'})
    TipoTramite:string;

    @IsNotEmpty({message:'DescripcionTramite es requerido'})
    DescripcionTramite:string;
}
