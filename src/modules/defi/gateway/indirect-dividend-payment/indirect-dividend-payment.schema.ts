import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type IndirectDividendPaymentDocument =
  HydratedDocument<IndirectDividendPayment>;

@Schema(dbOptionDefault)
export class IndirectDividendPayment extends BaseSchema {
  @Prop({ lowercase: true })
  root: string;

  @Prop({ lowercase: true })
  _issuer: string;

  @Prop({ lowercase: true })
  totalAmount: number;
}

export const IndirectDividendPaymentSchema = SchemaFactory.createForClass(
  IndirectDividendPayment,
);
IndirectDividendPaymentSchema.index(
  { chain: 1, hash: 1, logIndex: 1 },
  { unique: true },
);
IndirectDividendPaymentSchema.index({ status: 1, turn: 1 });
