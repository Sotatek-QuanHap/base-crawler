import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type CreateTrancheDocument = HydratedDocument<CreateTranche>;

@Schema(dbOptionDefault)
export class CreateTranche extends BaseSchema {
  @Prop({ lowercase: true })
  junior: string;

  @Prop({ lowercase: true })
  senior: string;
}

export const CreateTrancheSchema = SchemaFactory.createForClass(CreateTranche);
CreateTrancheSchema.index({ chain: 1, hash: 1, logIndex: 1 }, { unique: true });
CreateTrancheSchema.index({ status: 1, turn: 1 });
