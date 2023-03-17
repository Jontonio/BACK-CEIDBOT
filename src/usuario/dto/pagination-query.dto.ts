import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationQueryDto{

    @IsNumber()
    @IsPositive()
    @IsOptional()
    limit: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    offset:number;

}