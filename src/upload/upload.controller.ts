import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';

@ApiTags('File Upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload product image' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        imageUrl: { type: 'string' },
        filename: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    if (!this.uploadService.validateFileType(file)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.',
      );
    }

    // Validate file size
    if (!this.uploadService.validateFileSize(file)) {
      throw new BadRequestException('File size too large. Maximum size is 5MB.');
    }

    // Convert to base64
    const imageUrl = await this.uploadService.fileToBase64(file);
    const filename = this.uploadService.generateUniqueFilename(file.originalname);

    return {
      message: 'Image uploaded successfully',
      imageUrl,
      filename,
    };
  }
}
