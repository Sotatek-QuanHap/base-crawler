import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type CloseLoanDocument = HydratedDocument<CloseLoan>;

@Schema(dbOptionDefault)
export class CloseLoan extends BaseSchema {
  @Prop({ lowercase: true })
  from: string;
}

export const CloseLoanSchema = SchemaFactory.createForClass(CloseLoan);
CloseLoanSchema.index({ chain: 1, hash: 1, logIndex: 1 }, { unique: true });
CloseLoanSchema.index({ status: 1, turn: 1 });
