import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseListener } from '../base.listener';
import { PaymentDocument } from './payment.schema';
import { PaymentService } from './payment.service';

@Injectable()
export class PaymentListener extends BaseListener<PaymentDocument> {
  constructor(configService: ConfigService, service: PaymentService) {
    super(configService, service, service.queueCallbackName);
  }
}
