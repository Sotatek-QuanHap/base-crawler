import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type CreateCreditLineDocument = HydratedDocument<CreateCreditLine>;

@Schema(dbOptionDefault)
export class CreateCreditLine extends BaseSchema {
  @Prop({ lowercase: true })
  creditLine: string;
}

export const CreateCreditLineSchema =
  SchemaFactory.createForClass(CreateCreditLine);
CreateCreditLineSchema.index(
  { chain: 1, hash: 1, logIndex: 1 },
  { unique: true },
);
CreateCreditLineSchema.index({ status: 1, turn: 1 });
