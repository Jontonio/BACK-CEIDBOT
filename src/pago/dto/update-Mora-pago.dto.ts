import { PartialType } from '@nestjs/mapped-types';
import { CreateMoraPagoDto } from './mora-pago.dto';

export class UpdateMoraPagoDto extends PartialType(CreateMoraPagoDto) {}
