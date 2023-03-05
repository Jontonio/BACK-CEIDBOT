import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationQueryDto{

    @IsNumber()
    @IsPositive()
    @IsOptional()
    limit: number;

    @IsNumber()
    // @IsPositive()
    @Min(0)
    @IsOptional()
    offset:number;

}