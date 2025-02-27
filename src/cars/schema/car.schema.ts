import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CarDocument = Car & Document;

@Schema()
export class Car {
  @Prop({ required: true, ref: 'Brand', type: Types.ObjectId, index: true })
  brand: Types.ObjectId;

  @Prop({ required: true, ref: 'Model', type: Types.ObjectId, index: true })
  model: Types.ObjectId;

  @Prop({ required: true, index: true })
  createdAt: number;

  @Prop({ index: true })
  updatedAt: number;
}

// Creación del esquema
export const CarSchema = SchemaFactory.createForClass(Car);

// Agregar índice compuesto para garantizar la unicidad de brand y model juntos
CarSchema.index({ brand: 1, model: 1 }, { unique: true });
