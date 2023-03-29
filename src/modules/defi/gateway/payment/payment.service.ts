import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';
import { Payment, PaymentDocument } from './payment.schema';

@Injectable()
export class PaymentService extends BaseService<PaymentDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(Payment.name) paymentModel: Model<PaymentDocument>,
  ) {
    super(
      configService,
      configService.get<string>('queue_payment'.toLocaleLowerCase(), 'payment'),
      configService.get<string>(
        'queue_payment_callback'.toLocaleLowerCase(),
        'payment_callback',
      ),
      paymentModel,
    );
  }
}
