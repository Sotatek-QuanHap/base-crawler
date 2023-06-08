import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type InvestFundDocument = HydratedDocument<InvestFund>;

@Schema(dbOptionDefault)
export class InvestFund extends BaseSchema {
  @Prop({ lowercase: true })
  sender: string;

  @Prop({ lowercase: true })
  fund: string;

  @Prop({})
  amount: number;

  @Prop({ lowercase: true })
  issuer: string;
}

export const InvestFundSchema = SchemaFactory.createForClass(InvestFund);
InvestFundSchema.index({ chain: 1, hash: 1, logIndex: 1 }, { unique: true });
InvestFundSchema.index({ status: 1, turn: 1 });
