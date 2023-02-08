import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;
const options = {
  timestamps: true,
  _id: true,
  autoIndex: true,
};

@Schema(options)
export class Transaction {
  @Prop({ index: true, required: true })
  hash: string;

  @Prop({ index: true, default: 0 }) // 0: normal, 1: internal
  type: number;

  @Prop({})
  action: string;

  @Prop()
  from: string;

  @Prop()
  to: string;

  @Prop()
  value: number;

  @Prop()
  event: string;

  @Prop()
  address: string;

  @Prop({ required: true })
  chain: string;

  @Prop({ type: Object })
  message: Record<string, any>;

  @Prop({ type: Object })
  raw: Record<string, any>;

  @Prop({ default: false })
  sendWalletSuccess: boolean;

  @Prop({ default: 0 })
  retrySendWalletTurn: number;

  @Prop({ default: [] })
  internalTxs: Array<string>;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.index({ hash: 1, from: 1, to: 1 }, { unique: true });
