import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseListener } from '../base.listener';
import { CancelInvestmentDocument } from './cancel-investment.schema';
import { CancelInvestmentService } from './cancel-investment.service';

@Injectable()
export class CancelInvestmentListener extends BaseListener<CancelInvestmentDocument> {
  constructor(configService: ConfigService, service: CancelInvestmentService) {
    super(configService, service, service.queueCallbackName);
  }
}
