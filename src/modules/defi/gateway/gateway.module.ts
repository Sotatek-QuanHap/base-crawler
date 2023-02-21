import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ShareModule } from "src/common/share.module";
import { TransferSingleListener } from "./mintnft/transfer-single.listener";
import { TransferSingle, TransferSingleSchema } from "./mintnft/transfer-single.schema";
import { TransferSingleService } from "./mintnft/transfer-single.service";

@Module({
  imports: [ShareModule,
    MongooseModule.forFeature([
      { name: TransferSingle.name, schema: TransferSingleSchema },
    ]),],
  providers: [ConfigService, TransferSingleService, TransferSingleListener],
  exports: [TransferSingleService],
})
export class GatewayModule {
  // constructor(private transferSingleListener: TransferSingleListener) {
  //   this.transferSingleListener.listen();
  // }
}
