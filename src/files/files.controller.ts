import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerImageOptions } from 'src/common/config/files.config';
import { typeImagePipe } from 'src/common/pipe/parse-type-image.pipe';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerImageOptions))
  async uploadFile(
    @UploadedFile(typeImagePipe)
    file: Express.Multer.File,
    @Body('isPublic') isPublicRaw: string,
  ) {
    try {
      const result = await this.filesService.uploadFile(
        file,
        isPublicRaw === 'true',
      );
      return result;
    } catch (error) {
      return { message: 'Error uploading file', error: error.message };
    }
  }

  @Get(':imageId/url')
  getSignedUrl(@Param('imageId') imageId: string) {
    const url = this.filesService.generateSignedUrl(imageId);
    return { url };
  }
}
