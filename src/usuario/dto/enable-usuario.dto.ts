import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateUsuarioDto } from './create-usuario.dto';

export class EnableUserDto extends PartialType(CreateUsuarioDto) {

    @IsNotEmpty({message:'Habilitado es requerido'})
    @IsBoolean({message:'Habilitado tienen que ser de tipo BOOLEAN'})
    Habilitado:boolean;
}
