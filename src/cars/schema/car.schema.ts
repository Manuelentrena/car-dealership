import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CarDocument = Car & Document;

@Schema()
export class Car {
  @Prop({ required: true, unique: true, index: true })
  brand: string;

  @Prop({ required: true, unique: true, index: true })
  model: string;
}

// Creación del esquema
export const CarSchema = SchemaFactory.createForClass(Car);
