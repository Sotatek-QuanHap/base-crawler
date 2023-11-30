import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type DealCreatedDocument = HydratedDocument<DealCreated>;

@Schema(dbOptionDefault)
export class DealCreated extends BaseSchema {
  @Prop({})
  id: number;

  @Prop({ lowercase: true })
  deal: string;

  @Prop({ lowercase: true })
  dealWallet: string;

  @Prop({ lowercase: true })
  dealManager: string;

  @Prop({ lowercase: true })
  borrower: string;

  @Prop({ lowercase: true })
  from: string;

  @Prop({})
  dbPrjId: number;
}

export const DealCreatedSchema = SchemaFactory.createForClass(DealCreated);
DealCreatedSchema.index({ chain: 1, hash: 1, logIndex: 1 }, { unique: true });
DealCreatedSchema.index({ status: 1, turn: 1 });
