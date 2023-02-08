import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ethers } from "ethers";
import { ConfigCrawler, ConfigCrawlerDocument } from './common/configCrawlerService/configCrawler.schema';
@Injectable()
export class AppService {
  constructor(@InjectModel(ConfigCrawler.name) private model: Model<ConfigCrawlerDocument>) {
  }

  async testMongo(){

  }
  getHello(): string {
    return 'Hello World!';
  }
}