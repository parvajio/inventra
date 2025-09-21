import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString, IsUUID, MinLength } from 'class-validator';

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

  @ApiProperty({ example: 999.99 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @IsPositive()
  stock: number;

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
