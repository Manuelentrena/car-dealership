import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { AutoImage } from 'database/entities/auto-image.entity';
import { CloudflareService } from './cloudflare/cloudflare.service';
import { fileResponse } from './contract';

@Injectable()
export class FilesService {
  constructor(
    private readonly fileService: CloudflareService,
    private readonly configService: ConfigService,
  ) {}

  private readonly signingToken = this.configService.get(
    'cloudflare.signingToken',
  );
  private readonly accountHash = this.configService.get(
    'cloudflare.accountHash',
  );

  async uploadFile(
    file: Express.Multer.File,
    isPublic: boolean,
  ): Promise<fileResponse> {
    try {
      const result = await this.fileService.uploadImage(file, isPublic);
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

  public generateSignedUrl(
    imageId: string,
    variant = 'public',
    expiresInSeconds = 3600,
  ): string {
    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const path = `/${this.accountHash}/${imageId}/${variant}`;
    const query = `exp=${exp}`;
    const stringToSign = `${path}?${query}`;

    const sig = crypto
      .createHmac('sha256', this.signingToken)
      .update(stringToSign)
      .digest('hex');

    return `https://imagedelivery.net${path}?${query}&sig=${sig}`;
  }
}
