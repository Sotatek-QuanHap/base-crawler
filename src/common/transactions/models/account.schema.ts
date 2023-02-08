import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;
const options = {
  timestamps: true,
  _id: true,
  autoIndex: true,
};

@Schema(options)
export class Account {
  @Prop({ unique: true })
  address: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
