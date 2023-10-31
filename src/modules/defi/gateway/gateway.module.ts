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
@Module({
  imports: [
    ShareModule,
    MongooseModule.forFeature([
      { name: TransferSingle.name, schema: TransferSingleSchema },
      { name: LoanCreated.name, schema: LoanCreatedSchema },
    ]),
  ],
  providers: [
    ConfigService,
    LoadHash,
    TransferSingleService,
    TransferSingleListener,
    LoanCreatedService,
    LoanCreatedListener,
  ],
  exports: [TransferSingleService, LoanCreatedService],
})
export class GatewayModule {
  // constructor(private transferSingleListener: TransferSingleListener) {
  //   this.transferSingleListener.listen();
  // }
}
