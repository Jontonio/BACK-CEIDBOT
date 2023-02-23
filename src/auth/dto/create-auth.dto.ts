import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    @IsEmail()
    @IsNotEmpty()
    Email:string;

    @IsNotEmpty()
    Password:string;
}
