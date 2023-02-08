import { Injectable } from "@nestjs/common";
import { ConfigCrawler, ConfigCrawlerDocument } from "./configCrawler.schema";
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ConfigCrawlerService {
  private defaultByKey = {
    'binance-current-block': {
      valueLong: 23831455,
    },
    'account-url': {
      valueString: 'http://localhost:4156/api/v1/wallets'
    }
  };
  constructor(
    @InjectModel(ConfigCrawler.name) private configCrawlerModel: Model<ConfigCrawlerDocument>
  ) {
  }

  async getByKey(key: string): Promise<ConfigCrawlerDocument> {
    const config = await this.configCrawlerModel.findOne({ key });
    if (config)
      return config;
    try {
      return await this.configCrawlerModel.create({ key, valueString: '', valueLong: 0, ...this.defaultByKey[key] })
    } catch (error) {
      return await this.configCrawlerModel.findOne({ key });
    }
  }

  async inc(key: string): Promise<ConfigCrawlerDocument> {
    return await this.configCrawlerModel.findOneAndUpdate({ key }, { $set: { key }, $inc: { valueLong: 1 } }, { upsert: true, new: true });
  }
}
