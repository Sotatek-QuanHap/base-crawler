import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema(dbOptionDefault)
export class Payment extends BaseSchema {
  @Prop({ lowercase: true })
  payer: string;

  @Prop({ lowercase: true })
  pool: string;

  @Prop({})
  interestAmount: number;

  @Prop({})
  principalAmount: number;

  @Prop({})
  remainingAmount: number;

  @Prop({})
  reserveAmount: number;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.index({ chain: 1, hash: 1, logIndex: 1 }, { unique: true });
PaymentSchema.index({ status: 1, turn: 1 });
