import { IsDate, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateHorarioDto {

    @IsNotEmpty()
    @IsDate()
    HoraInicio:Date;
    
    @IsNotEmpty()
    @IsDate()
    HoraFinal:Date;
    
    @IsOptional()
    @IsString()
    @Length(0, 99)
    DescHorario:string;
}
