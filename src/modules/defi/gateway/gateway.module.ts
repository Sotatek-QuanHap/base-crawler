import { WithdrawListener } from './withdraw/withdraw-loan.listener';
import { Withdraw, WithdrawSchema } from './withdraw/withdraw-loan.schema';
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ShareModule } from "src/common/share.module";
import { CreateLoanListener } from "./createloan/create-loan.listener";
import { CreateLoan, CreateLoanSchema } from "./createloan/create-loan.schema";
import { CreateLoanService } from "./createloan/create-loan.service";
import { TransferSingleListener } from "./mintnft/transfer-single.listener";
import { TransferSingle, TransferSingleSchema } from "./mintnft/transfer-single.schema";
import { TransferSingleService } from "./mintnft/transfer-single.service";
import { LinkProxyListener } from "./proxy/link-proxy.listener";
import { LinkProxy, LinkProxySchema } from "./proxy/link-proxy.schema";
import { LinkProxyService } from "./proxy/link-proxy.service";
import { WithdrawService } from './withdraw/withdraw-loan.service';
import { Invest, InvestSchema } from './invest/invest.schema';
import { InvestService } from './invest/invest.service';
import { InvestListener } from './invest/invest.listener';
import { CreateTranche, CreateTrancheSchema } from './createtranche/create-tranche.schema';
import { CreateTrancheService } from './createtranche/create-tranche.service';
import { CreateTrancheListener } from './createtranche/create-tranche.listener';

@Module({
  imports: [ShareModule,
    MongooseModule.forFeature([
      { name: TransferSingle.name, schema: TransferSingleSchema },
      { name: CreateLoan.name, schema: CreateLoanSchema },
      { name: LinkProxy.name, schema: LinkProxySchema },
      { name: Withdraw.name, schema: WithdrawSchema },
      { name: Invest.name, schema: InvestSchema },
      { name: CreateTranche.name, schema: CreateTrancheSchema}, 
    ]),],
  providers: [ConfigService, TransferSingleService, TransferSingleListener, CreateLoanService, CreateLoanListener, LinkProxyService, LinkProxyListener, WithdrawService, WithdrawListener,InvestService, InvestListener, CreateTrancheService, CreateTrancheListener, ],
  exports: [TransferSingleService, CreateLoanService, LinkProxyService, WithdrawService, InvestService, CreateTrancheService, ],
})
export class GatewayModule {
  // constructor(private transferSingleListener: TransferSingleListener) {
  //   this.transferSingleListener.listen();
  // }
}
