import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type WithdrawDocument = HydratedDocument<Withdraw>;

@Schema(dbOptionDefault)
export class Withdraw extends BaseSchema {

  @Prop({ lowercase: true })
  owner: string;

  @Prop({ lowercase: true })
  tranche: string;

  @Prop({})
  trancheId: number;

  @Prop({})
  interestWithdrawn: number;

  @Prop({})
  principalWithdrawn: number;

}

export const WithdrawSchema = SchemaFactory.createForClass(Withdraw);
WithdrawSchema.index({ chain: 1, hash: 1, logIndex: 1 }, { unique: true });
WithdrawSchema.index({ status: 1, turn: 1 });
