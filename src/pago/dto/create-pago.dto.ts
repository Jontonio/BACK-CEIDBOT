import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CategoriaPago } from "src/categoria-pago/entities/categoria-pago.entity";
import { EstudianteEnGrupo } from "src/estudiante-en-grupo/entities/estudiante-en-grupo.entity";
import { GrupoModulo } from "src/grupo/entities/grupoModulo.entity";
import { MedioDePago } from "src/medio-de-pago/entities/medio-de-pago.entity";

export class CreatePagoDto {

    @IsNotEmpty({message:'VoucherUrl es requerido'})
    @IsString({message:'VoucherUrl tienen que ser de tipo STRING'})
    VoucherUrl:string;

    @IsNotEmpty({message:'FechaPago es requerido'})
    @IsDate({message:'FechaPago tienen que ser de tipo DATE'})
    FechaPago:Date;
    
    @IsNotEmpty({message:'CodigoVoucher es requerido'})
    @IsString({message:'CodigoVoucher tienen que ser de tipo STRING'})
    CodigoVoucher:string;

    @IsNotEmpty({message:'MontoPago es requerido'})
    @IsNumber()
    MontoPago:number;
    
    @IsNotEmpty({message:'medioDePago es requerido'})
    medioDePago:MedioDePago;

    @IsOptional() // se va a recibir solo cuando el estudiante este inscrito
    estudianteEnGrupo:EstudianteEnGrupo;
    
    @IsOptional()
    categoriaPago:CategoriaPago;

    @IsOptional() // se va a recibir este parametro si el pago será mensualidad o pago extenporaneo
    grupoModulo:GrupoModulo;
}
