import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CarDocument = Car & Document;

@Schema()
export class Car {
  @Prop({ required: true, ref: 'Brand', type: Types.ObjectId, index: true })
  brand: Types.ObjectId;

  @Prop({ required: true, unique: true, index: true })
  model: string;

  @Prop({ required: true, index: true })
  createdAt: number;

  @Prop({ index: true })
  updatedAt: number;
}

// Creación del esquema
export const CarSchema = SchemaFactory.createForClass(Car);
