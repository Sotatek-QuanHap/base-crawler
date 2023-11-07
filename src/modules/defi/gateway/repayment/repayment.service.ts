import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';
import { RepaymentDocument, Repayment } from './repayment.schema';

@Injectable()
export class RepaymentService extends BaseService<RepaymentDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(Repayment.name) RepaymentModel: Model<RepaymentDocument>,
  ) {
    super(
      configService,
      configService.get<string>(
        'queue_repayment_result'.toLocaleLowerCase(),
        'repayment-result',
      ),
      configService.get<string>(
        'queue_repayment_result_callback'.toLocaleLowerCase(),
        'repayment-result-callback',
      ),
      RepaymentModel,
    );
  }
}
