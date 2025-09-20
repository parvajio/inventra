import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString} from "class-validator";

export class ProductQueryDto {
  @ApiProperty({ example: 'clx1234567890abcdef', required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  minPrice?: number;

  @ApiProperty({ example: 100, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  maxPrice?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  limit?: number = 10;
}