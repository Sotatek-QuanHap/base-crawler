import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/rabbitmq/base.service';
import { BaseJob } from 'src/rabbitmq/base.job';
import {
  CrawlerInfo,
  CrawlerInfoDocument,
} from 'src/common/database/crawler.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoadHash } from 'src/modules/defi/gateway/loadHash.service';
import { RepaymentService } from 'src/modules/defi/gateway/repayment/repayment.service';
import { Store } from 'src/rabbitmq/store';
import TransferUSDC from './abis/transferUSDC.abi.json';
import { ethers } from 'ethers';

@Injectable()
export class RepaymentEthereumHandle extends BaseJob {
  private numberConfirmation = Number(
    this.configService.get<number>('NUMBER_CONFIRMATIONS_FOR_REPAYMENT', 1000),
  );
  constructor(
    configService: ConfigService,
    @InjectModel(CrawlerInfo.name) crawlerInfoModel: Model<CrawlerInfoDocument>,
    private loadHash: LoadHash,
    private repaymentService: RepaymentService,
  ) {
    super(configService, crawlerInfoModel);
    this.chain = 'ethereum';
    this.handles = [];
  }

  getNumberMessageLimit(): number {
    this.numberMessageLimit = +this.configService.get(
      `NUMBER_MESSAGE_REPAYMENT_REQUEST`.toUpperCase(),
      '0',
    );
    return this.numberMessageLimit;
  }

  getQueueName(): string {
    this.queueName = this.configService.get(
      `QUEUE_REQUEST_REPAYMENT_REQUEST`.toUpperCase(),
      `repayment_request`,
    );
    return this.queueName;
  }

  async process(message: any): Promise<void> {
    console.log('msg: ', message);
    const { hash, requestId } = message;
    const getTransaction = await this.loadHash.getTransaction(hash);
    if (
      !getTransaction ||
      getTransaction.to.toLowerCase() !==
        this.configService
          .get('USDC_ADDRESS', '0x813393c73333456d807ad1a58bd365f30354b0b0')
          .toLowerCase()
    ) {
      await Store.sendToQueue(
        this.configService.get<string>(
          'queue_repayment_result'.toLocaleLowerCase(),
          'repayment-result',
        ),
        Buffer.from(JSON.stringify({ ...message, status: 0 })), // status 0: reject, 1: verified
        super.configService,
      );
    } else if (getTransaction.confirmations < this.numberConfirmation) {
      await Store.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify(message)),
        super.configService,
      );
    } else if (getTransaction) {
      const getTransactionReceipt = await this.loadHash.getTransactionReceipt(
        hash,
      );
      const log = await this.loadHash.parseLogs(
        getTransactionReceipt.logs,
        TransferUSDC,
      );
      if (!log) {
        await Store.sendToQueue(
          this.configService.get<string>(
            'queue_repayment_result'.toLocaleLowerCase(),
            'repayment-result',
          ),
          Buffer.from(JSON.stringify({ ...message, status: 0 })),
          super.configService,
        );
      }
      const data: any = {};
      data.chain = getTransaction.chainId;
      data.hash = hash;
      data.logIndex = log.logIndex;
      data.from = log.args.from;
      data.to = log.args.to;
      data.value = log.args.value;
      data.timestamp = await this.loadHash.getTimestampBlockNumber(
        getTransaction.blockNumber,
      );
      data.block = getTransaction.blockNumber;
      data.requestId = requestId;
      await this.repaymentService.create(data);
    }
  }
}
