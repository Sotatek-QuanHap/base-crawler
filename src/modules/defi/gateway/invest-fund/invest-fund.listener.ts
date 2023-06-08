import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseListener } from '../base.listener';
import { InvestFundDocument } from './invest-fund.schema';
import { InvestFundService } from './invest-fund.service';

@Injectable()
export class InvestFundListener extends BaseListener<InvestFundDocument> {
  constructor(configService: ConfigService, service: InvestFundService) {
    super(configService, service, service.queueCallbackName);
  }
}
