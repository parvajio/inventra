import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Electronics', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({
    example: 'Electronic devices and accessories',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
