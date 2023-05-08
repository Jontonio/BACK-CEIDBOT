import { IsBoolean, IsDate, IsNotEmpty, IsOptional } from "class-validator";
import { Grupo } from "../entities/grupo.entity";
import { Modulo } from "src/curso/entities/modulo.entity";

export class CreateGrupoModuloDto {

    @IsNotEmpty({ message:'FechaPago es requerido' })
    @IsDate({ message:'FechaPago tiene que ser de tipo DATE' })
    FechaPago:Date;

    @IsOptional()
    @IsBoolean({ message:'CurrentModulo tiene que ser de tipo BOOLEAN'})
    CurrentModulo:boolean;
    /** atributos de tablas relacionadas */
    
    @IsNotEmpty({ message:'grupo es requerido' })
    grupo:Grupo;
    
    @IsNotEmpty({ message:'modulo es requerido' })
    modulo:Modulo;
}
