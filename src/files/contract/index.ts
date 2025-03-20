export interface IImageUploadService {
  uploadImage(file: Express.Multer.File): Promise<any>;
}
