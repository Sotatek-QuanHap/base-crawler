import { DealCreatedEthereumHandle } from './handles/deal-created.ethereum.handle';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CrawlerInfo,
  CrawlerInfoDocument,
} from 'src/common/database/crawler.schema';
import { BaseJob } from 'src/rabbitmq/base.job';
import { TransferSingleEthereumHandle } from './handles/transfer-single.ethereum.handle';
import { InvestedEthereumHandle } from './handles/invested.ethereum.handle';
import { RepaymentReceiptsConfirmedHandle } from './handles/repayment-receipts-confirmed.handle';

@Injectable()
export class EthereumJob extends BaseJob {
  constructor(
    configService: ConfigService,
    @InjectModel(CrawlerInfo.name) crawlerInfoModel: Model<CrawlerInfoDocument>,
    private transferSingleEthereumHandle: TransferSingleEthereumHandle,
    private dealCreatedEthereumHandle: DealCreatedEthereumHandle,
    private investedEthereumHandle: InvestedEthereumHandle,
    private repaymentReceiptsConfirmedHandle: RepaymentReceiptsConfirmedHandle,
  ) {
    super(configService, crawlerInfoModel);
    this.chain = 'ethereum';
    this.handles = [
      this.transferSingleEthereumHandle,
      this.dealCreatedEthereumHandle,
      this.investedEthereumHandle,
      this.repaymentReceiptsConfirmedHandle,
    ];
  }
}
