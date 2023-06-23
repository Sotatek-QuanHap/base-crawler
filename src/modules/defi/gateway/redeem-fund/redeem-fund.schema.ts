import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type RedeemFundDocument = HydratedDocument<RedeemFund>;

@Schema(dbOptionDefault)
export class RedeemFund extends BaseSchema {
  @Prop({ lowercase: true })
  investor: string;

  @Prop({})
  claimableAmount: number;

  @Prop({})
  checkPointIdx: number;
}

export const RedeemFundSchema = SchemaFactory.createForClass(RedeemFund);
RedeemFundSchema.index({ chain: 1, hash: 1, logIndex: 1 }, { unique: true });
RedeemFundSchema.index({ status: 1, turn: 1 });
