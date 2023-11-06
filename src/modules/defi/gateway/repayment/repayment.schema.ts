import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type RepaymentDocument = HydratedDocument<Repayment>;

@Schema(dbOptionDefault)
export class Repayment extends BaseSchema {
  @Prop({})
  id: number;

  @Prop({})
  value: number;

  @Prop({ lowercase: true })
  from: string;

  @Prop({ lowercase: true })
  to: string;

  @Prop({})
  requestId: number;
}

export const RepaymentSchema = SchemaFactory.createForClass(Repayment);
RepaymentSchema.index({ chain: 1, hash: 1, logIndex: 1 }, { unique: true });
RepaymentSchema.index({ status: 1, turn: 1 });
