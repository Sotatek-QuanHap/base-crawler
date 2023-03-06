import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type DrawdownDocument = HydratedDocument<Drawdown>;

@Schema(dbOptionDefault)
export class Drawdown extends BaseSchema {
  @Prop({ lowercase: true })
  borrower: string;

  @Prop({ lowercase: true })
  amount: string;
}

export const DrawdownSchema = SchemaFactory.createForClass(Drawdown);
DrawdownSchema.index({ chain: 1, hash: 1, logIndex: 1 }, { unique: true });
DrawdownSchema.index({ status: 1, turn: 1 });
