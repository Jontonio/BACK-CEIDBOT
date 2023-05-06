import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateTramiteDto {

    @IsNotEmpty({message:'UrlRequisito es requerido'})
    @IsString({message:'UrlRequisito tienen que ser de tipo STRING'})
    @IsUrl()
    UrlRequisito:string;
    
    @IsOptional()
    @IsUrl()
    UrlRequisitoExtra:string;
}
