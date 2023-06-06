import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CrawlerInfo,
  CrawlerInfoDocument,
} from 'src/common/database/crawler.schema';
import { BaseJob } from 'src/rabbitmq/base.job';

@Injectable()
export class EthereumJobByRange extends BaseJob {
  constructor(
    configService: ConfigService,
    @InjectModel(CrawlerInfo.name) crawlerInfoModel: Model<CrawlerInfoDocument>,
  ) {
    super(configService, crawlerInfoModel);
    this.chain = 'ethereum';
    this.handles = [
    ];
  }

  getNumberMessageLimit(): number {
    this.numberMessageLimit = +this.configService.get(
      `NUMBER_MESSAGE_REQUEST_BY_RANGE_OF_${this.chain}`.toUpperCase(),
      '0',
    );
    console.log(
      'getNumberMessageLimit of ' + this.chain,
      this.numberMessageLimit,
    );
    return this.numberMessageLimit;
  }

  getQueueName(): string {
    this.queueName = this.configService.get(
      `QUEUE_REQUEST_BLOCK_BY_RANGE_OF_${this.chain}`.toUpperCase(),
      `request-block-by-range-${this.chain}`,
    );
    return this.queueName;
  }
}
