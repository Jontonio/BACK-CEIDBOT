import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { EstudianteEnGrupo } from "src/estudiante-en-grupo/entities/estudiante-en-grupo.entity";
import { GrupoModulo } from "src/grupo/entities/grupoModulo.entity";

export class CreateMoraPagoDto {

    @IsOptional()
    EstadoMora:boolean;

    @IsOptional()
    Verificado:boolean;

    @IsNotEmpty({ message:'MontoMora tienen que ser de tipo NUMBER' })
    @IsNumber()
    MontoMora:number;

    /** Tablas relacionados */
    @IsNotEmpty({ message:'El Id del estudiante en grupo es necesario (estudianteEnGrupo)' })
    estudianteEnGrupo:EstudianteEnGrupo;

    @IsOptional({ message:'El Id del estudiante en grupo es necesario (estudianteEnGrupo)' })
    grupoModulo:GrupoModulo;
}
