import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';
import { RedeemFund, RedeemFundDocument } from './redeem-fund.schema';

@Injectable()
export class RedeemFundService extends BaseService<RedeemFundDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(RedeemFund.name) redeemFundModel: Model<RedeemFundDocument>,
  ) {
    super(
      configService,
      configService.get<string>(
        'queue_redeem_fund'.toLocaleLowerCase(),
        'redeem-fund',
      ),
      configService.get<string>(
        'queue_redeem_fund_callback'.toLocaleLowerCase(),
        'redeem-fund-callback',
      ),
      redeemFundModel,
    );
  }
}
