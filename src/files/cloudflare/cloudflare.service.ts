import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import { lastValueFrom } from 'rxjs';
import { fileResponse, IImageUploadService } from '../contract';
import { adaptCloudflareResponse } from './cloudflare.adapter';

@Injectable()
export class CloudflareService implements IImageUploadService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<fileResponse> {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const headers = {
      Authorization: `Bearer ${this.configService.get('cloudflare.apiToken')}`,
      ...formData.getHeaders(),
    };

    const url = `https://api.cloudflare.com/client/v4/accounts/${this.configService.get(
      'cloudflare.accountId',
    )}/images/v1`;

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, formData, { headers }),
      );
      return adaptCloudflareResponse(response.data);
    } catch (error) {
      console.error(
        'Error uploading image:',
        error.response?.data || error.message,
      );
      throw new Error('Error uploading image');
    }
  }
}
