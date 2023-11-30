import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type InvestedDocument = HydratedDocument<Invested>;

@Schema(dbOptionDefault)
export class Invested extends BaseSchema {
  @Prop({})
  id: number;

  @Prop({ lowercase: true })
  investor: string;

  @Prop({ lowercase: true })
  fund: string;

  @Prop({})
  investmentDate: number;

  @Prop({})
  amount: number;

  @Prop({})
  salt: number;

  @Prop({})
  expirationTime: number;

  @Prop({ lowercase: true })
  dealWallet: string;

  @Prop({ lowercase: true })
  investmentHash: string;
}

export const InvestedSchema = SchemaFactory.createForClass(Invested);
InvestedSchema.index({ chain: 1, hash: 1, logIndex: 1 }, { unique: true });
InvestedSchema.index({ status: 1, turn: 1 });
