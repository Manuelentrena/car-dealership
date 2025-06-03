import { Injectable } from '@nestjs/common';
import { AutoImage } from 'database/entities/auto-image.entity';
import { CloudflareService } from './cloudflare/cloudflare.service';
import { fileResponse } from './contract';

@Injectable()
export class FilesService {
  constructor(private readonly fileService: CloudflareService) {}

  async uploadFile(file: Express.Multer.File): Promise<fileResponse> {
    try {
      const result = await this.fileService.uploadImage(file);
      return result;
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }

  async deleteFile(file: AutoImage): Promise<boolean> {
    try {
      const result = await this.fileService.deleteImage(file);
      return result;
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }
}
