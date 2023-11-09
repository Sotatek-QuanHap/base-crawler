import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseListener } from '../base.listener';
import { RepaymentReceiptsConfirmedService } from './repayment-receipts-confirmed.service';
import { RepaymentReceiptsConfirmedDocument } from './repayment-receipts-confirmed.schema';

@Injectable()
export class RepaymentReceiptsConfirmedListener extends BaseListener<RepaymentReceiptsConfirmedDocument> {
  constructor(
    configService: ConfigService,
    service: RepaymentReceiptsConfirmedService,
  ) {
    super(configService, service, service.queueCallbackName);
  }
}
