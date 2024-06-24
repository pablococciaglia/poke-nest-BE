import { IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Min(1)
  limit?: number;

  @IsInt()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  offset?: number;
}
