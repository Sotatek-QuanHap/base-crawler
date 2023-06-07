import { TimeUtils } from "src/utils/time.utils";
import { Store } from "./store";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CrawlerInfo, CrawlerInfoDocument } from "src/common/database/crawler.schema";
import { Model } from "mongoose";

@Injectable()
export class ThreadHandler {
  constructor(@InjectModel(CrawlerInfo.name) private crawlerInfoModel: Model<CrawlerInfoDocument>) {

  }

  toNormalize(obj: any = {}, keys: string[] = [], rs: any = {}) {
    for (const key in obj) {
      const value = obj[key];
      if (typeof (value) == 'object') {
        this.toNormalize(value, [...keys, key], rs);
      } else {
        rs[[...keys, key].join('.')] = value;
      }
    }
  }

  async run() {
    console.log('begin thread handler');
    while (true) {
      const data = Store.pop();
      console.log('data of logs: ', data);
      if (!data) {
        await TimeUtils.sleepRandom();
        continue;
      }
      const { blockInfo, sumary } = data;
      const { chainId, block, chain, timestamp } = blockInfo;
      const sumaries = {};
      this.toNormalize(sumary, ['sumaries'], sumaries);
      console.log('sumaries: ', sumaries);

      try {
        await this.crawlerInfoModel.findOneAndUpdate(
          { chainId, block },
          {
            $set: {
              chainId,
              block,
              chain,
              timestamp,
              ...sumaries,
            },
            $inc: { total: 1 }

          },
          { upsert: true },
        );
      } catch (e) {

      }
    }
  }
}