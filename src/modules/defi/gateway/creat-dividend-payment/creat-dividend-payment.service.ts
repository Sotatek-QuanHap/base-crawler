import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';
import {
  CreatDividendPayment,
  CreatDividendPaymentDocument,
} from './creat-dividend-payment.schema';

@Injectable()
export class CreatDividendPaymentService extends BaseService<CreatDividendPaymentDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(CreatDividendPayment.name)
    CreatDividendPaymentModel: Model<CreatDividendPaymentDocument>,
  ) {
    super(
      configService,
      configService.get<string>(
        'queue_creat_dividend_payment'.toLocaleLowerCase(),
        'creat-dividend-payment',
      ),
      configService.get<string>(
        'queue_creat_dividend_payment_callback'.toLocaleLowerCase(),
        'creat-dividend-payment-callback',
      ),
      CreatDividendPaymentModel,
    );
  }
}
