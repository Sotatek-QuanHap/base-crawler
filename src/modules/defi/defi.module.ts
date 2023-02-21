import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ShareModule } from "src/common/share.module";
import { EthereumJob } from "./chains/ethereum/crawler.ethereum.job";
import { TransferSingleEthereumHandle } from "./chains/ethereum/handles/transfer-single.ethereum.handle";
import { GatewayModule } from "./gateway/gateway.module";
@Module({
  imports: [ShareModule, GatewayModule,],
  providers: [ConfigService, EthereumJob, TransferSingleEthereumHandle],
  exports: [],
})
export class DefiModule {
  constructor(private ethereumJob: EthereumJob) {
    this.ethereumJob.listen();
  }
}
