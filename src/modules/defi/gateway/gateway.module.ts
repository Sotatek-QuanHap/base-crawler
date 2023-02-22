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

@Module({
  imports: [ShareModule,
    MongooseModule.forFeature([
      { name: TransferSingle.name, schema: TransferSingleSchema },
      { name: CreateLoan.name, schema: CreateLoanSchema }
    ]),],
  providers: [ConfigService, TransferSingleService, TransferSingleListener, CreateLoanService, CreateLoanListener],
  exports: [TransferSingleService, CreateLoanService],
})
export class GatewayModule {
  // constructor(private transferSingleListener: TransferSingleListener) {
  //   this.transferSingleListener.listen();
  // }
}
