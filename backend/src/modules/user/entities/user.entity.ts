import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IRole } from '../interfaces/role.interface';

export type UserDocument = User & Document;

@Schema({
  id: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class User {
  @Prop({ type: mongoose.Schema.Types.String })
  _id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  kid: string;

  @Prop({ required: true, type: mongoose.Schema.Types.String, unique: true })
  email: string;

  @Prop({ required: true, type: mongoose.Schema.Types.String, unique: true })
  username: string;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  firstName: string;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  lastName: string;

  @Prop({ required: false, type: [mongoose.Schema.Types.String] })
  clients: string[];

  @Prop({
    required: false,
    type: [mongoose.Schema.Types.Mixed],
  })
  roles: IRole[];

  @Prop({ required: false, type: [mongoose.Schema.Types.String] })
  groups: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
