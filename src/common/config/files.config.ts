import { BadRequestException } from '@nestjs/common';
import { Options } from 'multer';

export const MAX_IMAGES_BY_AUTO = 5;

export const imageFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file) return callback(new BadRequestException('File is empty'), false);
  return callback(null, true);
};

export const multerImageOptions: Options = {
  fileFilter: imageFileFilter,
  // limits: { fileSize: 2 * 1024 * 1024 }, // ejemplo: 2MB máximo por archivo
};
