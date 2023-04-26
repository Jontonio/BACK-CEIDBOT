import { PartialType } from '@nestjs/mapped-types';
import { CreateEstadoGrupoDto } from './create-estado-grupo.dto';

export class UpdateEstadoGrupoDto extends PartialType(CreateEstadoGrupoDto) {}
