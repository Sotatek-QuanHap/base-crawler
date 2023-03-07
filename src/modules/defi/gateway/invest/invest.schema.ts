import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type InvestDocument = HydratedDocument<Invest>;

@Schema(dbOptionDefault)
export class Invest extends BaseSchema {
  @Prop({ lowercase: true })
  owner: string;

  @Prop({ lowercase: true })
  tranche: string;

  @Prop({})
  trancheId: number;

  @Prop({ lowercase: true })
  amount: string;
}

export const InvestSchema = SchemaFactory.createForClass(Invest);
InvestSchema.index({ chain: 1, hash: 1, logIndex: 1 }, { unique: true });
InvestSchema.index({ status: 1, turn: 1 });
