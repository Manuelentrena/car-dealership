import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CloudflareService } from './cloudflare/cloudflare.service';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [HttpModule],
  controllers: [FilesController],
  providers: [FilesService, CloudflareService],
  exports: [FilesService],
})
export class FilesModule {}
