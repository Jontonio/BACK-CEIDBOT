import { IsNotEmpty, IsNumber } from "class-validator";

export class ConfigNotificacionDto {

    @IsNotEmpty({ message:'HoraNotificacion es requerido' })
    @IsNumber()
    HoraNotificacion:number;

    @IsNotEmpty({ message:'El MinutoNotificacion es requerido' })
    @IsNumber()
    MinutoNotificacion:number;
    
    @IsNotEmpty({ message:'El DescriptionNotificacion es requerido' })
    DescriptionNotificacion:string;
}
