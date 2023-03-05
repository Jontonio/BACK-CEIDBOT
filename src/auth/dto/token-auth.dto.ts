import {IsNotEmpty, IsString } from "class-validator";

export class TokenAuthDto {
    
    @IsString()
    @IsNotEmpty()
    token:string;
}
