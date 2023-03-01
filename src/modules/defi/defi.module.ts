import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ShareModule } from "src/common/share.module";
import { EthereumJob } from "./chains/ethereum/crawler.ethereum.job";
import { CreateLoanEthereumHandle } from "./chains/ethereum/handles/create-loan.ethereum.handle";
import { InvestEthereumHandle } from "./chains/ethereum/handles/invest.ethereum.handle";
import { LinkProxyEthereumHandle } from "./chains/ethereum/handles/link-proxy.ethereum.handle";
import { TransferSingleEthereumHandle } from "./chains/ethereum/handles/transfer-single.ethereum.handle";
import { WithdrawEthereumHandle } from "./chains/ethereum/handles/withdraw-loan.ethereum.handle";
import { GatewayModule } from "./gateway/gateway.module";
@Module({
  imports: [ShareModule, GatewayModule,],
  providers: [ConfigService, EthereumJob, TransferSingleEthereumHandle, CreateLoanEthereumHandle, LinkProxyEthereumHandle, WithdrawEthereumHandle, InvestEthereumHandle],
  exports: [],
})
export class DefiModule {
  constructor(private ethereumJob: EthereumJob) {
    this.ethereumJob.listen();
  }
}
