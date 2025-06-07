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
import { AuthUser } from 'src/common/decorators';
import { Auth } from 'src/common/decorators/auth.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UserRole } from 'src/common/enums';
import { AuthUser as AuthUserType } from 'src/common/interface/auth-user.interface';
import { UUIDOrSlugPipe } from 'src/common/pipe/parse-slug.pipe';
import { validateTypeImages } from 'src/common/pipe/parse-type-image.pipe';
import { AutoService } from './auto.service';
import { CreateAutoDto } from './dto/create-auto.dto';
import { UpdateAutoDto } from './dto/update-auto.dto';

@Controller('autos')
export class AutoController {
  constructor(private readonly autoService: AutoService) {}

  @Auth(UserRole.User)
  @Get()
  findAll(
    @AuthUser() user: AuthUserType,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.autoService.findAll(paginationDto, user);
  }

  @Auth(UserRole.User)
  @Get(':term')
  findOne(@Param('term', UUIDOrSlugPipe) term: string) {
    return this.autoService.getAutoWithImagesForClient(term);
  }

  @Post()
  @Auth(UserRole.User)
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'images', maxCount: MAX_IMAGES_BY_AUTO }],
      multerImageOptions,
    ),
  )
  create(
    @AuthUser() user: AuthUserType,
    @Body() createAutoDto: CreateAutoDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    validateTypeImages(files.images);
    createAutoDto.images = files.images;
    return this.autoService.create(createAutoDto, user);
  }

  @Auth(UserRole.User)
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

  @Auth(UserRole.User)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.autoService.remove(id);
  }
}
