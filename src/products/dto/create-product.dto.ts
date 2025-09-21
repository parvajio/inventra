import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString, MinLength, Matches } from "class-validator";

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 'Latest iPhone with advanced features',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 999.99 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  stock: number;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 'cmftn65j80001iq28qlw6ge7m' })
  @IsString()
  @Matches(/^c[a-z0-9]{24}$/, { message: 'categoryId must be a valid CUID' })
  categoryId: string;
}


export class ProductSearchDto {
  @ApiProperty({ example: 'iPhone' })
  @IsString()
  @MinLength(1)
  q: string;
}