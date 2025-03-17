import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoImage } from 'database/entities/auto-image.entity';
import { Auto } from 'database/entities/auto.entity';
import { AutoController } from './auto.controller';
import { AutoService } from './auto.service';

@Module({
  imports: [TypeOrmModule.forFeature([Auto, AutoImage])],
  controllers: [AutoController],
  providers: [AutoService],
})
export class AutoModule {}
