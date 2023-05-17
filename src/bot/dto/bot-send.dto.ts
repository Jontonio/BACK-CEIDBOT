import { IsNotEmpty, Matches } from "class-validator";

export class BotSendDto {

    @IsNotEmpty({ message:'El Nombres del destinatario' })
    Nombres:string;

    @IsNotEmpty({ message:'El Numero de celular es requerido (formato 00000000000@c.us mas el prefijo)' })
    @Matches(/^\d{8,14}@c\.us$/,{ message:'El número de whatsapp'})
    Numero:string; 

    @IsNotEmpty({ message:'El Message es requerido'})
    Message:string;
}
