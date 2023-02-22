import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, dbOptionDefault } from 'src/common/database/base.schema';

export type LinkProxyDocument = HydratedDocument<LinkProxy>;

@Schema(dbOptionDefault)
export class LinkProxy extends BaseSchema {
  @Prop({ lowercase: true })
  borrower: string;

  @Prop({ lowercase: true })
  owner: string;
}

export const LinkProxySchema = SchemaFactory.createForClass(LinkProxy);
LinkProxySchema.index({ chain: 1, hash: 1, logIndex: 1 }, { unique: true });
LinkProxySchema.index({ status: 1, turn: 1 });
