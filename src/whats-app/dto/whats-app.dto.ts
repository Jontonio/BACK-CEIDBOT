import { IsNotEmpty, Matches } from "class-validator";

export class WhatsAppDto{

    @IsNotEmpty({ message:'El Numero de celular es requerido' })
    @Matches(/^\d{8,14}@c\.us$/,{ message:'El número de whatsapp'})
    Numero:string;

    @IsNotEmpty({ message:'El Message es requerido debe tener el formato 00000000000@c.us mas el prefijo' })
    Message:string;
}