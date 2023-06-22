import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type CreatDividendPaymentDocument =
  HydratedDocument<CreatDividendPayment>;

@Schema(dbOptionDefault)
export class CreatDividendPayment extends BaseSchema {
  @Prop({ lowercase: true })
  issuer: string;

  @Prop({})
  totalAmount: number;

  @Prop({})
  historyLen: number;

  @Prop({})
  paymentType: number;

  @Prop({ lowercase: true })
  root: string;

  @Prop({})
  uuid: number;
}

export const CreatDividendPaymentSchema =
  SchemaFactory.createForClass(CreatDividendPayment);
CreatDividendPaymentSchema.index(
  { chain: 1, hash: 1, logIndex: 1 },
  { unique: true },
);
CreatDividendPaymentSchema.index({ status: 1, turn: 1 });
