import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type CreateLoanDocument = HydratedDocument<CreateLoan>;

@Schema(dbOptionDefault)
export class CreateLoan extends BaseSchema {
  @Prop({ lowercase: true })
  pool: string;

  @Prop({ lowercase: true })
  borrower: string;

  @Prop({ lowercase: true })
  from: string;
}

export const CreateLoanSchema = SchemaFactory.createForClass(CreateLoan);
CreateLoanSchema.index({ chain: 1, hash: 1, logIndex: 1 }, { unique: true });
CreateLoanSchema.index({ status: 1, turn: 1 });
