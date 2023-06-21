import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseListener } from '../base.listener';
import { IndirectDividendPaymentDocument } from './indirect-dividend-payment.schema';
import { IndirectDividendPaymentService } from './indirect-dividend-payment.service';

@Injectable()
export class IndirectDividendPaymentListener extends BaseListener<IndirectDividendPaymentDocument> {
  constructor(
    configService: ConfigService,
    service: IndirectDividendPaymentService,
  ) {
    super(configService, service, service.queueCallbackName);
  }
}
