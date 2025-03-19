import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { createReadStream, existsSync, mkdirSync, writeFileSync } from 'fs';
import * as mime from 'mime-types';
import { extname, join } from 'path';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const nameFile = `${randomUUID()}${extname(file.originalname)}`;
    const uploadDir = join(process.cwd(), 'uploads');
    const filePath = join(uploadDir, nameFile);

    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    writeFileSync(filePath, file.buffer);
    return { message: 'Archivo guardado', filename: nameFile };
  }

  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', filename);

    if (!existsSync(filePath)) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    res.setHeader('Content-Type', mimeType);

    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }
}
