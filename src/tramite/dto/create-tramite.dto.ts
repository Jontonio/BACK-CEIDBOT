import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { Estudiante } from "src/estudiante/entities/estudiante.entity";
import { Pago } from "src/pago/entities/pago.entity";
import { TipoTramite } from "src/tipo-tramite/entities/tipo-tramite.entity";

export class CreateTramiteDto {

    @IsNotEmpty({message:'UrlRequisito es requerido'})
    @IsString({message:'UrlRequisito tienen que ser de tipo STRING'})
    @IsUrl()
    UrlRequisito:string;
    
    @IsOptional()
    UrlRequisitoExtra:string;

    @IsNotEmpty({message:'UrlRequisito es requerido'})
    estudiante:Estudiante;

    @IsNotEmpty({message:'tipoTramite es requerido'})
    tipoTramite:TipoTramite;

    @IsNotEmpty({message:'pago es requerido'})
    pago:Pago;
}
