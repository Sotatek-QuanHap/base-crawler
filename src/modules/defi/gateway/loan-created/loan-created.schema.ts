import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type LoanCreatedDocument = HydratedDocument<LoanCreated>;

@Schema(dbOptionDefault)
export class LoanCreated extends BaseSchema {
  @Prop({})
  id: number;

  @Prop({ lowercase: true })
  loan: string;

  @Prop({ lowercase: true })
  loanWallet: string;

  @Prop({ lowercase: true })
  loanManager: string;

  @Prop({ lowercase: true })
  borrower: string;

  @Prop({ lowercase: true })
  from: string;

  @Prop({})
  dbPrjId: number;
}

export const LoanCreatedSchema = SchemaFactory.createForClass(LoanCreated);
LoanCreatedSchema.index({ chain: 1, hash: 1, logIndex: 1 }, { unique: true });
LoanCreatedSchema.index({ status: 1, turn: 1 });
