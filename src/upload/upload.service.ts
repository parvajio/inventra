import { Injectable } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class UploadService {
  // unique filename
  generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const ext = extname(originalName);
    return `${timestamp}-${randomString}${ext}`;
  }

  // Convert to base64
  async fileToBase64(file: Express.Multer.File): Promise<string> {
    const base64 = file.buffer.toString('base64');
    const mimeType = file.mimetype;
    return `data:${mimeType};base64,${base64}`;
  }

  //file type
  validateFileType(file: Express.Multer.File): boolean {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    return allowedMimeTypes.includes(file.mimetype);
  }

  // file size
  validateFileSize(file: Express.Multer.File): boolean {
    const maxSize = 5 * 1024 * 1024; 
    return file.size <= maxSize;
  }
}
