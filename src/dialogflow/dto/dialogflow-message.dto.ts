import { IsArray, IsNotEmpty } from "class-validator";

export class DialogFlowTextDto{

    @IsNotEmpty({ message:'text es requerido' })
    @IsArray({ message:'text tiene que ser de tipo ARRAY'})
    text: string[];
} 