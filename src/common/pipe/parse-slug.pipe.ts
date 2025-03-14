import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { isSLUG } from 'src/common/utils/utils';

@Injectable()
export class UUIDOrSlugPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('Term must not be empty');
    }

    const isUuid = isUUID(value);
    const isSlug = isSLUG(value);

    if (!isUuid && !isSlug) {
      throw new BadRequestException('Term must be a valid UUID or slug');
    }

    return value;
  }
}
