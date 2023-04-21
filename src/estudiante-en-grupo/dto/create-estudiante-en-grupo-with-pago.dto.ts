import { IsNotEmpty } from "class-validator";
import { Estudiante } from "src/estudiante/entities/estudiante.entity";
import { Grupo } from "src/grupo/entities/grupo.entity";
import { Matricula } from "src/matricula/entities/matricula.entity";
import { Pago } from "src/pago/entities/pago.entity";

export class EstudianteEnGrupoWithPagoDto {

    @IsNotEmpty({message:'Id estudiante es requerido de tipo objeto Estudiante (FK)'})
    estudiante:Estudiante;
    
    @IsNotEmpty({message:'Id grupo es requerido de tipo objeto Grupo (FK)'})
    grupo:Grupo;
    
    @IsNotEmpty({message:'Id matricula es requerido de tipo objeto Matricula (FK)'})
    matricula:Matricula;

    @IsNotEmpty({message:'Id Pago es requerido de tipo objeto pago (FK)'})
    pagos:Pago[];
}
