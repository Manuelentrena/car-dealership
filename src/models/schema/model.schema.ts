import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ModelDocument = Model & Document;

@Schema()
export class Model {
  @Prop({ required: true, unique: true, index: true })
  name: string;
  @Prop({ required: true, index: true })
  createdAt: number;
  @Prop({ index: true })
  updatedAt: number;
}

// Creación del esquema
export const ModelSchema = SchemaFactory.createForClass(Model);
