import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';
import { InvestFund, InvestFundDocument } from './invest-fund.schema';

@Injectable()
export class InvestFundService extends BaseService<InvestFundDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(InvestFund.name)
    transferSingleModel: Model<InvestFundDocument>,
  ) {
    super(
      configService,
      configService.get<string>(
        'queue_invest_fund'.toLocaleLowerCase(),
        'invest_fund',
      ),
      configService.get<string>(
        'queue_invest_fund_callback'.toLocaleLowerCase(),
        'invest_fund_callback',
      ),
      transferSingleModel,
    );
  }
}
