import { IsNotEmpty, IsString, } from "class-validator";
export class ReniecUsuarioDto {
    
    @IsString()
    @IsNotEmpty()
    DNI:string;    
}
