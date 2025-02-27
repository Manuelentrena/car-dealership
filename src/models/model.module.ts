import { Module } from '@nestjs/common';
import { ModelService } from './models.service';
import { ModelController } from './models.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ModelSchema } from './schema/model.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Model.name, schema: ModelSchema }]),
  ],
  controllers: [ModelController],
  providers: [ModelService],
  exports: [
    ModelService,
    MongooseModule.forFeature([{ name: Model.name, schema: ModelSchema }]),
  ],
})
export class ModelModule {}
