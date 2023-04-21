import { IsNotEmpty, IsString } from "class-validator";
import { EstudianteEnGrupo } from "src/estudiante-en-grupo/entities/estudiante-en-grupo.entity";

export class FirstPagoDto {

    @IsNotEmpty({message:'VoucherUrl es requerido'})
    @IsString({message:'VoucherUrl tienen que ser de tipo STRING'})
    VoucherUrl:string;

    @IsNotEmpty({message:'Es necesario el Id de la estudianteEnGrupo dentro del objeto EstudianteEnGrupo'})
    estudianteEnGrupo:EstudianteEnGrupo;
}
