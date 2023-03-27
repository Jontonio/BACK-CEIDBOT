import { PartialType } from '@nestjs/mapped-types';
import { CreateEstudianteEnGrupoDto } from './create-estudiante-en-grupo.dto';

export class UpdateEstudianteEnGrupoDto extends PartialType(CreateEstudianteEnGrupoDto) {}
