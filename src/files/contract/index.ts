import { AutoImage } from 'database/entities/auto-image.entity';

export interface IImageUploadService {
  uploadImage(file: Express.Multer.File): Promise<fileResponse>;
  deleteImage(file: AutoImage): Promise<boolean>;
}

export interface fileResponse {
  id: string;
  filename: string;
  url: string;
}
