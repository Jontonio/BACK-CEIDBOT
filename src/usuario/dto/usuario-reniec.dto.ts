import { IsNotEmpty, IsString, } from "class-validator";
export class ReniecUsuarioDto {
    
    @IsNotEmpty({message:'DNI es requerido'})
    @IsString({message:'DNI tiene que ser de tipo STRING'})
    DNI:string;    
}
