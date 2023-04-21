import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CategoriaPago } from "src/categoria-pago/entities/categoria-pago.entity";
import { EstudianteEnGrupo } from "src/estudiante-en-grupo/entities/estudiante-en-grupo.entity";

export class CreatePagoDto {

    // @MaxLength(5, {message:'TipoDocumento tiene permitido como máximo 5 carácteres'})
    @IsNotEmpty({message:'VoucherUrl es requerido'})
    @IsString({message:'VoucherUrl tienen que ser de tipo STRING'})
    VoucherUrl:string;

    @IsNotEmpty({message:'FechaPago es requerido'})
    @IsDate({message:'FechaPago tienen que ser de tipo DATE'})
    FechaPago:Date;
    
    @IsNotEmpty({message:'CodigoVocuher es requerido'})
    @IsString({message:'CodigoVocuher tienen que ser de tipo STRING'})
    CodigoVocuher:string;

    @IsNotEmpty({message:'MontoPago es requerido'})
    @IsNumber()
    MontoPago:number;

    @IsNotEmpty({message:'Es necesario el Id de estudianteEnGrupo dentro del objeto EstudianteEnGrupo'})
    estudianteEnGrupo:EstudianteEnGrupo;
    
    @IsNotEmpty({message:'Es necesario el Id de CategoriaPago dentro del objeto categoriaPago'})
    categoriaPago:CategoriaPago;
}
