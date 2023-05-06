import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoTramiteDto } from './create-tipo-tramite.dto';

export class UpdateTipoTramiteDto extends PartialType(CreateTipoTramiteDto) {}
