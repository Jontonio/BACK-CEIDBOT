import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class LogoutAuthDto {
    
    @IsNumber()
    @IsNotEmpty()
    Id:number;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    Email:string;
}
