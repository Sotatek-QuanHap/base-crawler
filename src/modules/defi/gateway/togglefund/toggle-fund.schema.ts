import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type ToggleFundDocument = HydratedDocument<ToggleFund>;

@Schema(dbOptionDefault)
export class ToggleFund extends BaseSchema {
  @Prop()
  status: number;
}

export const ToggleFundSchema = SchemaFactory.createForClass(ToggleFund);
ToggleFundSchema.index({ chain: 1, hash: 1, logIndex: 1 }, { unique: true });
ToggleFundSchema.index({ status: 1, turn: 1 });
