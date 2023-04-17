import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type TransferSingleDocument = HydratedDocument<TransferSingle>;

@Schema(dbOptionDefault)
export class TransferSingle extends BaseSchema {
  @Prop({})
  id: number;

  @Prop({})
  value: number;

  @Prop({ index: true, lowercase: true })
  operator: string;

  @Prop({ lowercase: true })
  from: string;

  @Prop({ lowercase: true })
  to: string;
}

export const TransferSingleSchema =
  SchemaFactory.createForClass(TransferSingle);
TransferSingleSchema.index(
  { chain: 1, hash: 1, logIndex: 1 },
  { unique: true },
);
TransferSingleSchema.index({ status: 1, turn: 1 });
