import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type CancelLoanDocument = HydratedDocument<CancelLoan>;

@Schema(dbOptionDefault)
export class CancelLoan extends BaseSchema {
}

export const CancelLoanSchema = SchemaFactory.createForClass(CancelLoan);
CancelLoanSchema.index({ chain: 1, hash: 1, logIndex: 1 }, { unique: true });
CancelLoanSchema.index({ status: 1, turn: 1 });
