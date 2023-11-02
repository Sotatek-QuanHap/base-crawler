import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ShareModule } from 'src/common/share.module';
import { EthereumJob } from './chains/ethereum/crawler.ethereum.job';
import { TransferSingleEthereumHandle } from './chains/ethereum/handles/transfer-single.ethereum.handle';
import { GatewayModule } from './gateway/gateway.module';

import { EthereumJobByRange } from './chains/ethereum/crawler.ethereum.job_by_range';
import { LoanCreatedEthereumHandle } from './chains/ethereum/handles/loan-created.ethereum.handle';
import { InvestedEthereumHandle } from './chains/ethereum/handles/invested.ethereum.handle';

@Module({
  imports: [ShareModule, GatewayModule],
  providers: [
    ConfigService,
    EthereumJob,
    EthereumJobByRange,
    TransferSingleEthereumHandle,
    LoanCreatedEthereumHandle,
    InvestedEthereumHandle,
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
