export interface IImageUploadService {
  uploadImage(file: Express.Multer.File): Promise<fileResponse>;
}

export interface fileResponse {
  id: string;
  filename: string;
  url: string;
}
