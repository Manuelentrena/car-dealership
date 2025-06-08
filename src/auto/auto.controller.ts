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
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
import { AutoWithImages } from './dto/auto-with-images.dto';
import { CreateAutoResponse } from './dto/create-auto-response.dto';
import { CreateAutoDto } from './dto/create-auto.dto';
import { PaginationAuto } from './dto/pagination-auto.dto';
import { UpdateAutoDto } from './dto/update-auto.dto';

@ApiTags('Autos')
@ApiBearerAuth()
@Controller('autos')
export class AutoController {
  constructor(private readonly autoService: AutoService) {}

  @Auth(UserRole.User)
  @Get()
  @ApiOperation({ summary: 'List all autos for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({
    description: 'List of autos returned successfully',
    type: PaginationAuto,
  })
  public findAll(
    @AuthUser() user: AuthUserType,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.autoService.findAll(paginationDto, user);
  }

  @Auth(UserRole.User)
  @Get(':term')
  @ApiOperation({ summary: 'Get a specific auto by ID or slug' })
  @ApiParam({ name: 'term', description: 'UUID or slug of the auto' })
  @ApiOkResponse({ description: 'Auto found', type: AutoWithImages })
  @ApiResponse({ status: 404, description: 'Auto not found' })
  public findOne(@Param('term', UUIDOrSlugPipe) term: string) {
    return this.autoService.getAutoWithImagesForClient(term);
  }

  @Post()
  @Auth(UserRole.User)
  @ApiOperation({ summary: 'Create a new auto' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'images', maxCount: MAX_IMAGES_BY_AUTO }],
      multerImageOptions,
    ),
  )
  @ApiBody({
    description: 'Auto data and images',
    type: CreateAutoDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Auto created successfully',
    type: CreateAutoResponse,
  })
  public create(
    @AuthUser() user: AuthUserType,
    @Body() createAutoDto: CreateAutoDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    validateTypeImages(files.images);
    createAutoDto.images = files.images;
    return this.autoService.create(createAutoDto, user);
  }

  @Patch(':id')
  @Auth(UserRole.User)
  @ApiOperation({ summary: 'Update an existing auto' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the auto' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'images', maxCount: MAX_IMAGES_BY_AUTO }],
      multerImageOptions,
    ),
  )
  @ApiBody({
    description: 'Updated auto data and optional new images',
    type: UpdateAutoDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Auto updated successfully',
    type: CreateAutoResponse,
  })
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAutoDto: UpdateAutoDto,
    @UploadedFiles() files: { images: Express.Multer.File[] },
  ) {
    validateTypeImages(files.images);
    updateAutoDto.images = files.images;
    return this.autoService.update(id, updateAutoDto);
  }

  @Delete(':id')
  @Auth(UserRole.User)
  @ApiOperation({ summary: 'Delete an auto by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the auto' })
  @ApiResponse({
    status: 200,
    description: 'Auto deleted successfully',
    type: CreateAutoResponse,
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.autoService.remove(id);
  }
}
