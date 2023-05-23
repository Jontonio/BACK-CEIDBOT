import { PartialType } from '@nestjs/mapped-types';
import { CreateDenominServicioDto } from '../dto/create-denomin-servicio.dto';

export class UpdateDenominServicioDto extends PartialType(CreateDenominServicioDto) {}
