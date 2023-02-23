import { IsNotEmpty, IsString, } from "class-validator";
export class ReniecUserDto {
    
    @IsString()
    @IsNotEmpty()
    DNI:string;    
}
