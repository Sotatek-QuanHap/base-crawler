import { Prop } from "@nestjs/mongoose";
export const dbOptionDefault = {
  timestamps: true,
  _id: true,
  autoIndex: true,
}
export class BaseSchema {
  @Prop({ required: true })
  hash: string;

  @Prop({ required: true })
  logIndex: string;

  @Prop({})
  chain: string;

  @Prop({ lowercase: true, index: true })
  address: string;

  @Prop({})
  chainId: number;

  @Prop({})
  block: number;

  @Prop({})
  timestamp: number;

  @Prop({ default: 0 })// 0: init, 1: sending, 2: error, 3: success
  status: number;

  @Prop({})
  message: string;

  @Prop({ default: 0 })
  turn: number;
}
