import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { dbOptionDefault } from "./base.schema";
export type CrawlerInfoDocument = HydratedDocument<CrawlerInfo>;

@Schema(dbOptionDefault)
export class CrawlerInfo {
  @Prop({})
  chain: string;

  @Prop({})
  chainId: number;

  @Prop({})
  block: number;

  @Prop({})
  timestamp: number;

  @Prop({})
  total: number;

  // @Prop(raw({
  //   total: { type: Number, default: 0 },
  //   success: { type: Number, default: 0 },
  // }))
  @Prop(raw({
    
  }))
  sumaries: Record<string, any>;
}
export const CrawlerInfoSchema = SchemaFactory.createForClass(CrawlerInfo);
CrawlerInfoSchema.index({ chainId: 1, block: 1 }, { unique: true });
