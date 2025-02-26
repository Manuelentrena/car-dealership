import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandDocument = Brand & Document;

@Schema()
export class Brand {
  @Prop({ required: true, unique: true, index: true })
  name: string;
  @Prop({ required: true, index: true })
  createdAt: number;
  @Prop({ index: true })
  updatedAt: number;
}

// Creación del esquema
export const BrandSchema = SchemaFactory.createForClass(Brand);
