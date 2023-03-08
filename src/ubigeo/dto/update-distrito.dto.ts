import { PartialType } from '@nestjs/mapped-types';
import { CreateProvinviaDto } from './create-distrito.dto';

export class UpdateUbigeoDto extends PartialType(CreateProvinviaDto) {}
