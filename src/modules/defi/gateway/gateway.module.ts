import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ShareModule } from 'src/common/share.module';
import { TransferSingleListener } from './mintnft/transfer-single.listener';
import {
  TransferSingle,
  TransferSingleSchema,
} from './mintnft/transfer-single.schema';
import { TransferSingleService } from './mintnft/transfer-single.service';
import {
  LoanCreated,
  LoanCreatedSchema,
} from './loan-created/loan-created.schema';
import { LoanCreatedService } from './loan-created/loan-created.service';
import { LoanCreatedListener } from './loan-created/loan-created.listener';
import { LoadHash } from './loadHash.service';
import { Invested, InvestedSchema } from './invested/invested.schema';
import { InvestedListener } from './invested/invested.listener';
import { InvestedService } from './invested/invested.service';
@Module({
  imports: [
    ShareModule,
    MongooseModule.forFeature([
      { name: TransferSingle.name, schema: TransferSingleSchema },
      { name: LoanCreated.name, schema: LoanCreatedSchema },
      { name: Invested.name, schema: InvestedSchema },
    ]),
  ],
  providers: [
    ConfigService,
    LoadHash,
    TransferSingleService,
    TransferSingleListener,
    LoanCreatedService,
    LoanCreatedListener,
    InvestedService,
    InvestedListener,
  ],
  exports: [TransferSingleService, LoanCreatedService, InvestedService],
})
export class GatewayModule {
  // constructor(private transferSingleListener: TransferSingleListener) {
  //   this.transferSingleListener.listen();
  // }
}
