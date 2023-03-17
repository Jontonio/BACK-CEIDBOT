import { IsDate, IsNotEmpty, IsOptional, MaxLength } from "class-validator";

export class CreateHorarioDto {

    @IsNotEmpty({message:'HoraInicio es requerido'})
    @IsDate({message:'HoraInicio tienen que ser de tipo DATE'})
    HoraInicio:Date;
    
    @IsNotEmpty({message:'HoraFinal es requerido'})
    @IsDate({message:'HoraFinal tienen que ser de tipo DATE'})
    HoraFinal:Date;
    
    @IsOptional()
    @MaxLength(350, {message:'DescHorario tiene permitido como máximo 350 carácteres'})
    DescHorario:string;
}
