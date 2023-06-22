import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';
import {
  CancelInvestment,
  CancelInvestmentDocument,
} from './cancel-investment.schema';
import { loadHash } from '../loadHash.service';

@Injectable()
export class CancelInvestmentService extends BaseService<CancelInvestmentDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(CancelInvestment.name)
    cancelInvestmentModel: Model<CancelInvestmentDocument>,
    private loadHash: loadHash,
  ) {
    super(
      configService,
      configService.get<string>(
        'queue_cancel_investment'.toLocaleLowerCase(),
        'cancel-investment',
      ),
      configService.get<string>(
        'queue_cancel_investment_callback'.toLocaleLowerCase(),
        'cancel-investment-callback',
      ),
      cancelInvestmentModel,
    );
  }
}
