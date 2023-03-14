import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';
import { CancelLoan, CancelLoanDocument } from './cancel-loan.schema';

@Injectable()
export class CancelLoanService extends BaseService<CancelLoanDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(CancelLoan.name) cancelLoanModel: Model<CancelLoanDocument>,
  ) {
    super(
      configService,
      configService.get<string>(
        'queue_cancel-loan'.toLocaleLowerCase(),
        'cancel-loan',
      ),
      configService.get<string>(
        'queue_cancel-loan_callback'.toLocaleLowerCase(),
        'cancel-loan-callback',
      ),
      cancelLoanModel,
    );
  }
}
