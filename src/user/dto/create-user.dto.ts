import { IsEmail, IsNotEmpty, IsString } from "class-validator";
export class CreateUserDto {
    
    @IsString()
    @IsNotEmpty()
    DNI:string;

    @IsString()
    @IsNotEmpty()
    Name:string;

    @IsString()
    @IsNotEmpty()
    FirstName:string;

    @IsString()
    @IsNotEmpty()
    LastName:string;

    @IsEmail()
    @IsNotEmpty()
    Email:string;

    @IsNotEmpty()
    Password:string;

    @IsNotEmpty()
    roleId:number;
    
}
