import {
  BadRequestException,
  HttpStatus,
  ParseFilePipeBuilder,
} from '@nestjs/common';

export const typeImagePipe = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: /(jpg|jpeg|png|gif|webp)$/,
  })
  .build({
    errorHttpStatusCode: HttpStatus.BAD_REQUEST,
  });

export function validateTypeImages(images: Express.Multer.File[] = []) {
  for (const file of images) {
    const isValid = /(jpg|jpeg|png|gif|webp)$/.test(
      file.mimetype.split('/')[1],
    );
    if (!isValid) {
      throw new BadRequestException(`Invalid image type: ${file.originalname}`);
    }
  }
}
