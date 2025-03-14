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
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UUIDOrSlugPipe } from 'src/common/pipe/parse-slug.pipe';
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
  create(@Body() createAutoDto: CreateAutoDto) {
    return this.autoService.create(createAutoDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAutoDto: UpdateAutoDto,
  ) {
    return this.autoService.update(id, updateAutoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.autoService.remove(id);
  }
}
