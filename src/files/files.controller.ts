import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.filesService.uploadFile(file);
      return result;
    } catch (error) {
      return { message: 'Error uploading file', error: error.message };
    }
  }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   if (!file) {
  //     throw new BadRequestException('No se ha enviado ningún archivo.');
  //   }
  //   const nameFile = `${randomUUID()}${extname(file.originalname)}`;
  //   const uploadDir = join(process.cwd(), 'uploads');
  //   const filePath = join(uploadDir, nameFile);

  //   if (!existsSync(uploadDir)) {
  //     mkdirSync(uploadDir, { recursive: true });
  //   }

  //   writeFileSync(filePath, file.buffer);
  //   return { message: 'Archivo guardado', filename: nameFile };
  // }

  // @Get(':filename')
  // getFile(@Param('filename') filename: string, @Res() res: Response) {
  //   const filePath = join(process.cwd(), 'uploads', filename);

  //   if (!existsSync(filePath)) {
  //     return res.status(404).json({ message: 'Archivo no encontrado' });
  //   }
  //   const mimeType = mime.lookup(filePath) || 'application/octet-stream';
  //   res.setHeader('Content-Type', mimeType);

  //   const fileStream = createReadStream(filePath);
  //   fileStream.pipe(res);
  // }
}
