import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CrawlerInfo, CrawlerInfoDocument } from "src/common/database/crawler.schema";
import { BaseJob } from "src/rabbitmq/base.job";
import { CreateLoanEthereumHandle } from "./handles/create-loan.ethereum.handle";
import { LinkProxyEthereumHandle } from "./handles/link-proxy.ethereum.handle";
import { TransferSingleEthereumHandle } from "./handles/transfer-single.ethereum.handle";

@Injectable()
export class EthereumJob extends BaseJob {
  constructor(
    configService: ConfigService,
    @InjectModel(CrawlerInfo.name) crawlerInfoModel: Model<CrawlerInfoDocument>,
    private transferSingleEthereumHandle: TransferSingleEthereumHandle,
    private createLoanEthereumHandle: CreateLoanEthereumHandle,
    private linkProxyEthereumHandle: LinkProxyEthereumHandle,
  ) {
    super(configService, crawlerInfoModel);
    this.chain = 'ethereum';
    this.handles = [
      this.transferSingleEthereumHandle,
      this.createLoanEthereumHandle,
      this.linkProxyEthereumHandle,
    ];
  }
}
