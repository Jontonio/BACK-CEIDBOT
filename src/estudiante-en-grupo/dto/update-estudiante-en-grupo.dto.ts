import { PartialType } from '@nestjs/mapped-types';
import { EstudianteEnGrupoWithPagoDto } from './create-estudiante-en-grupo-with-pago.dto';

export class UpdateEstudianteEnGrupoDto extends PartialType( EstudianteEnGrupoWithPagoDto ) {}
