import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CrawlerInfo, CrawlerInfoDocument } from "src/common/database/crawler.schema";
import { BaseJob } from "src/rabbitmq/base.job";
import { TransferSingleEthereumHandle } from "./handles/transfer-single.ethereum.handle";

@Injectable()
export class EthereumJob extends BaseJob {
  constructor(
    configService: ConfigService,
   @InjectModel(CrawlerInfo.name) crawlerInfoModel: Model<CrawlerInfoDocument>,
    private transferSingleEthereumHandle: TransferSingleEthereumHandle
  ) {
    super(configService, crawlerInfoModel);
    this.chain = 'ethereum';
    this.handles = [
      this.transferSingleEthereumHandle,
    ];
  }
}
