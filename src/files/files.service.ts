import { Injectable } from '@nestjs/common';
import { CloudflareService } from './cloudflare/cloudflare.service';

@Injectable()
export class FilesService {
  constructor(private readonly fileService: CloudflareService) {}

  async uploadFile(file: Express.Multer.File): Promise<any> {
    try {
      const result = await this.fileService.uploadImage(file);
      return result;
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }
}
