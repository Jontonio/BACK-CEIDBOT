import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { EstudianteEnGrupo } from "src/estudiante-en-grupo/entities/estudiante-en-grupo.entity";

export class CreateMensualidadDto {

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

    @IsNotEmpty({message:'Es necesario el Id de la estudianteEnGrupo dentro del objeto EstudianteEnGrupo'})
    estudianteEnGrupo:EstudianteEnGrupo;
}
