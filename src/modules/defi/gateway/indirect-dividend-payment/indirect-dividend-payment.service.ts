import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';
import {
  IndirectDividendPayment,
  IndirectDividendPaymentDocument,
} from './indirect-dividend-payment.schema';

@Injectable()
export class IndirectDividendPaymentService extends BaseService<IndirectDividendPaymentDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(IndirectDividendPayment.name)
    IndirectDividendPaymentModel: Model<IndirectDividendPaymentDocument>,
  ) {
    super(
      configService,
      configService.get<string>(
        'queue_indirect_dividend_payment'.toLocaleLowerCase(),
        'indirect-dividend-payment',
      ),
      configService.get<string>(
        'queue_indirect_dividend_payment_callback'.toLocaleLowerCase(),
        'indirect-dividend-payment-callback',
      ),
      IndirectDividendPaymentModel,
    );
  }
}
