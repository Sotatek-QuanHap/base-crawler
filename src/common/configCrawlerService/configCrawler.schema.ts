import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConfigCrawlerDocument = HydratedDocument<ConfigCrawler>;

@Schema()
export class ConfigCrawler {
  @Prop({ unique: true })
  key: string;

  @Prop({ default: '' })
  valueString: string;

  @Prop({ default: 0 })
  valueLong: number;
}

export const ConfigCrawlerSchema = SchemaFactory.createForClass(ConfigCrawler);
