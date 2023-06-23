import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ShareModule } from 'src/common/share.module';
import { EthereumJob } from './chains/ethereum/crawler.ethereum.job';
import { CreateLoanEthereumHandle } from './chains/ethereum/handles/create-loan.ethereum.handle';
import { LinkProxyEthereumHandle } from './chains/ethereum/handles/link-proxy.ethereum.handle';
import { TransferSingleEthereumHandle } from './chains/ethereum/handles/transfer-single.ethereum.handle';
import { WithdrawEthereumHandle } from './chains/ethereum/handles/withdraw-loan.ethereum.handle';
import { GatewayModule } from './gateway/gateway.module';
import { DrawdownEthereumHandle } from './chains/ethereum/handles/drawdown.ethereum.handle';
import { InvestEthereumHandle } from './chains/ethereum/handles/invest.ethereum.handle';
import { CreateMultiTrancheEthereumHandle } from './chains/ethereum/handles/create-multi-tranche.ethereum.handle';
import { CreateUniTrancheEthereumHandle } from './chains/ethereum/handles/create-uni-tranche.ethereum.handle';
import { CreateCreditLineHandle } from './chains/ethereum/handles/create-credit-line.ethereum.handle';
import { CancelLoanEthereumHandle } from './chains/ethereum/handles/cancel-loan.ethereum.handle';
import { PaymentEthereumHandle } from './chains/ethereum/handles/payment.ethereum.handle';
import { CloseLoanEthereumHandle } from './chains/ethereum/handles/close-loan.ethereum.handle';
import { CreateFundEthereumHandle } from './chains/ethereum/handles/create-fund.ethereum.handle';
import { ToggleFundEthereumHandle } from './chains/ethereum/handles/toggle-fund.ethereum.handle';
import { EthereumJobByRange } from './chains/ethereum/crawler.ethereum.job_by_range';
import { InvestedFundEthereumHandle } from './chains/ethereum/handles/invest-fund.ethereum.handle';
import { CreatDividendPaymentEthereumHandle } from './chains/ethereum/handles/creat-dividend-payment.ethereum.handle';
import { CancelInvestmentEthereumHandle } from './chains/ethereum/handles/cancel-investment.ethereum.handle';
import { RedeemFundEthereumHandle } from './chains/ethereum/handles/redeem-fund.ethereum.handle';
@Module({
  imports: [ShareModule, GatewayModule],
  providers: [
    ConfigService,
    EthereumJob,
    EthereumJobByRange,
    TransferSingleEthereumHandle,
    CreateLoanEthereumHandle,
    LinkProxyEthereumHandle,
    WithdrawEthereumHandle,
    DrawdownEthereumHandle,
    InvestEthereumHandle,
    CreateMultiTrancheEthereumHandle,
    CreateUniTrancheEthereumHandle,
    CreateCreditLineHandle,
    CancelLoanEthereumHandle,
    PaymentEthereumHandle,
    CloseLoanEthereumHandle,
    CreateFundEthereumHandle,
    ToggleFundEthereumHandle,
    InvestedFundEthereumHandle,
    CreatDividendPaymentEthereumHandle,
    CancelInvestmentEthereumHandle,
    RedeemFundEthereumHandle,
  ],
  exports: [],
})
export class DefiModule {
  constructor(
    private ethereumJob: EthereumJob,
    private ethereumJobByRange: EthereumJobByRange,
  ) {
    this.ethereumJob.listen();
    this.ethereumJobByRange.setHandlers(this.ethereumJob.getHandlers());
    console.log(
      this.ethereumJob.getQueueName(),
      this.ethereumJobByRange.getQueueName(),
    );
    this.ethereumJobByRange.listen();
  }
}
