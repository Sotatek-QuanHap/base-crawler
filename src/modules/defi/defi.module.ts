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
import { CreateTrancheEthereumHandle } from './chains/ethereum/handles/create-tranche.ethereum.handle';
import { CreateCreditLineHandle } from './chains/ethereum/handles/create-credit-line.ethereum.handle';
import { CancelLoanEthereumHandle } from './chains/ethereum/handles/cancel-loan.ethereum.handle';
import { PaymentEthereumHandle } from './chains/ethereum/handles/payment.ethereum.handle';
@Module({
  imports: [ShareModule, GatewayModule],
  providers: [
    ConfigService,
    EthereumJob,
    TransferSingleEthereumHandle,
    CreateLoanEthereumHandle,
    LinkProxyEthereumHandle,
    WithdrawEthereumHandle,
    DrawdownEthereumHandle,
    InvestEthereumHandle,
    CreateTrancheEthereumHandle,
    CreateCreditLineHandle,
    CancelLoanEthereumHandle,
    PaymentEthereumHandle,
  ],
  exports: [],
})
export class DefiModule {
  constructor(private ethereumJob: EthereumJob) {
    this.ethereumJob.listen();
  }
}
