import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseListener } from '../base.listener';
import { RedeemFundService } from './redeem-fund.service';
import { RedeemFundDocument } from './redeem-fund.schema';

@Injectable()
export class RedeemFundListener extends BaseListener<RedeemFundDocument> {
  constructor(configService: ConfigService, service: RedeemFundService) {
    super(configService, service, service.queueCallbackName);
  }
}
