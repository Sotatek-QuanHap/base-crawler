import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseListener } from '../base.listener';
import { CreatDividendPaymentDocument } from './creat-dividend-payment.schema';
import { CreatDividendPaymentService } from './creat-dividend-payment.service';

@Injectable()
export class CreatDividendPaymentListener extends BaseListener<CreatDividendPaymentDocument> {
  constructor(
    configService: ConfigService,
    service: CreatDividendPaymentService,
  ) {
    super(configService, service, service.queueCallbackName);
  }
}
