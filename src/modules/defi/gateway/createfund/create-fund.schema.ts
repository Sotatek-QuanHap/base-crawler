import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type CreateFundDocument = HydratedDocument<CreateFund>;

@Schema(dbOptionDefault)
export class CreateFund extends BaseSchema {
  @Prop({ lowercase: true })
  fund: string;

  @Prop({ lowercase: true })
  issuer: string;

  @Prop()
  dbPrjId: number;

  @Prop({ lowercase: true })
  from: string;
}

export const CreateFundSchema = SchemaFactory.createForClass(CreateFund);
CreateFundSchema.index({ chain: 1, hash: 1, logIndex: 1 }, { unique: true });
CreateFundSchema.index({ status: 1, turn: 1 });
