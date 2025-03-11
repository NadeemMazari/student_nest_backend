import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  toJSON: {
    transform: (doc, ret) => {
      ret._id = doc._id.toString(); // Convert _id to string
      delete ret.__v; // Remove version key
      return ret;
    },
  },
  toObject: {
    transform: (doc, ret) => {
      ret._id = doc._id.toString(); // Convert _id to string
      delete ret.__v;
      return ret;
    },
  },
})
export class Student extends Document {
  _id: Types.ObjectId; // Explicitly type _id

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  dateOfBirth: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
