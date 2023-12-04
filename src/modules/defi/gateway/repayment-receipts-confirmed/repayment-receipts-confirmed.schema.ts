import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type RepaymentReceiptsConfirmedDocument =
  HydratedDocument<RepaymentReceiptsConfirmed>;

@Schema(dbOptionDefault)
export class RepaymentReceiptsConfirmed extends BaseSchema {
  @Prop({})
  id: number;

  @Prop({ lowercase: true })
  from: string;

  @Prop({ lowercase: true })
  txHash: string;

  @Prop({ lowercase: true })
  investor: string;

  @Prop({})
  txType: number;

  @Prop({})
  principalRepaid: number;

  @Prop({})
  returnPaid: number;
}

export const RepaymentReceiptsConfirmedSchema = SchemaFactory.createForClass(
  RepaymentReceiptsConfirmed,
);
RepaymentReceiptsConfirmedSchema.index(
  { chain: 1, hash: 1, logIndex: 1 },
  { unique: true },
);
RepaymentReceiptsConfirmedSchema.index({ status: 1, turn: 1 });
