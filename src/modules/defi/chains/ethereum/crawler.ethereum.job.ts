import { WithdrawEthereumHandle } from './handles/withdraw-loan.ethereum.handle';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CrawlerInfo,
  CrawlerInfoDocument,
} from 'src/common/database/crawler.schema';
import { BaseJob } from 'src/rabbitmq/base.job';
import { CreateLoanEthereumHandle } from './handles/create-loan.ethereum.handle';
import { LinkProxyEthereumHandle } from './handles/link-proxy.ethereum.handle';
import { TransferSingleEthereumHandle } from './handles/transfer-single.ethereum.handle';
import { InvestEthereumHandle } from './handles/invest.ethereum.handle';
import { CreateMultiTrancheEthereumHandle } from './handles/create-multi-tranche.ethereum.handle';
import { CreateUniTrancheEthereumHandle } from './handles/create-uni-tranche.ethereum.handle';
import { DrawdownEthereumHandle } from './handles/drawdown.ethereum.handle';
import { CreateCreditLineHandle } from './handles/create-credit-line.ethereum.handle';
import { CancelLoanEthereumHandle } from './handles/cancel-loan.ethereum.handle';
import { PaymentEthereumHandle } from './handles/payment.ethereum.handle';

@Injectable()
export class EthereumJob extends BaseJob {
  constructor(
    configService: ConfigService,
    @InjectModel(CrawlerInfo.name) crawlerInfoModel: Model<CrawlerInfoDocument>,
    private transferSingleEthereumHandle: TransferSingleEthereumHandle,
    private createLoanEthereumHandle: CreateLoanEthereumHandle,
    private linkProxyEthereumHandle: LinkProxyEthereumHandle,
    private withdrawEthereumHandle: WithdrawEthereumHandle,
    private InvestHandle: InvestEthereumHandle,
    private createMultiTrancheEthereumHandle: CreateMultiTrancheEthereumHandle,
    private createUniTrancheEthereumHandle: CreateUniTrancheEthereumHandle,
    private drawdownEthereumHandle: DrawdownEthereumHandle,
    private createCreditLineHandle: CreateCreditLineHandle,
    private cancelLoanEthereumHandle: CancelLoanEthereumHandle,
    private paymentEthereumHandle: PaymentEthereumHandle,
  ) {
    super(configService, crawlerInfoModel);
    this.chain = 'ethereum';
    this.handles = [
      this.transferSingleEthereumHandle,
      this.createLoanEthereumHandle,
      this.linkProxyEthereumHandle,
      this.withdrawEthereumHandle,
      this.InvestHandle,
      this.createMultiTrancheEthereumHandle,
      this.createUniTrancheEthereumHandle,
      this.drawdownEthereumHandle,
      this.createCreditLineHandle,
      this.cancelLoanEthereumHandle,
      this.paymentEthereumHandle,
    ];
  }
}
