import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  MAX_IMAGES_BY_AUTO,
  multerImageOptions,
} from 'src/common/config/files.config';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UUIDOrSlugPipe } from 'src/common/pipe/parse-slug.pipe';
import { validateTypeImages } from 'src/common/pipe/parse-type-image.pipe';
import { AutoService } from './auto.service';
import { CreateAutoDto } from './dto/create-auto.dto';
import { UpdateAutoDto } from './dto/update-auto.dto';

@Controller('autos')
export class AutoController {
  constructor(private readonly autoService: AutoService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.autoService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term', UUIDOrSlugPipe) term: string) {
    return this.autoService.findOne(term);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'images', maxCount: MAX_IMAGES_BY_AUTO }],
      multerImageOptions,
    ),
  )
  create(
    @Body() createAutoDto: CreateAutoDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    validateTypeImages(files.images);
    createAutoDto.images = files.images;
    return this.autoService.create(createAutoDto);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'images', maxCount: MAX_IMAGES_BY_AUTO }],
      multerImageOptions,
    ),
  )
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAutoDto: UpdateAutoDto,
    @UploadedFiles() files: { images: Express.Multer.File[] },
  ) {
    validateTypeImages(files.images);
    updateAutoDto.images = files.images;
    return this.autoService.update(id, updateAutoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.autoService.remove(id);
  }
}
