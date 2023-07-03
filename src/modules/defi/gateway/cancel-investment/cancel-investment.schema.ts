import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type CancelInvestmentDocument = HydratedDocument<CancelInvestment>;

@Schema(dbOptionDefault)
export class CancelInvestment extends BaseSchema {
  @Prop({ lowercase: true })
  account: string;

  @Prop({})
  subscriptionDate: number;

  @Prop({})
  amount: number;

  @Prop({})
  signingTime: number;

  @Prop({})
  hashInfo: string;
}

export const CancelInvestmentSchema =
  SchemaFactory.createForClass(CancelInvestment);
CancelInvestmentSchema.index(
  { chain: 1, hash: 1, logIndex: 1 },
  { unique: true },
);
CancelInvestmentSchema.index({ status: 1, turn: 1 });
