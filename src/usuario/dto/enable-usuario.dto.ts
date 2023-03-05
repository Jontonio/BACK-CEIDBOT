import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateUsuarioDto } from './create-usuario.dto';

export class EnableUserDto extends PartialType(CreateUsuarioDto) {

    @IsBoolean()
    @IsNotEmpty()
    Habilitado:boolean;
}
