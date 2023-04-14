import { IsNotEmpty, IsOptional } from "class-validator";
import { Estudiante } from "src/estudiante/entities/estudiante.entity";
import { Grupo } from "src/grupo/entities/grupo.entity";
import { Matricula } from "src/matricula/entities/matricula.entity";
import { Mensualidad } from "src/mensualidad/entities/mensualidad.entity";

export class CreateEstudianteEnGrupoDto {

    @IsNotEmpty({message:'Id estudiante es requerido de tipo objeto Estudiante (FK)'})
    estudiante:Estudiante;
    @IsNotEmpty({message:'Id grupo es requerido de tipo objeto Grupo (FK)'})
    grupo:Grupo;
    @IsNotEmpty({message:'Id matricula es requerido de tipo objeto Matricula (FK)'})
    matricula:Matricula;

    @IsOptional()
    mensualidad:Mensualidad;
}
