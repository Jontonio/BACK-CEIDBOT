import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaPagoDto } from './create-categoria-pago.dto';

export class UpdateCategoriaPagoDto extends PartialType(CreateCategoriaPagoDto) {}
