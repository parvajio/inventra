import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductWithFileDto {
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

  @ApiProperty({ example: '999.99' })
  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, { message: 'price must be a valid positive number' })
  price: string;

  @ApiProperty({ example: '50' })
  @IsString()
  @Matches(/^\d+$/, { message: 'stock must be a valid positive integer' })
  stock: string;

  @ApiProperty({ example: 'cmftn65j80001iq28qlw6ge7m' })
  @IsString()
  @Matches(/^c[a-z0-9]{24}$/, { message: 'categoryId must be a valid CUID' })
  categoryId: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Product image file (JPEG, PNG, GIF, WebP)',
    required: false,
  })
  @IsOptional()
  image?: Express.Multer.File;
}
