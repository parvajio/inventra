import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString, IsUUID, MinLength, Matches } from 'class-validator';
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

  @ApiProperty({ example: 'clx1234567890abcdef' })
  @IsString()
  @IsUUID()
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
