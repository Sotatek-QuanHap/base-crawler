import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseListener } from '../base.listener';
import { CancelLoanDocument } from './cancel-loan.schema';
import { CancelLoanService } from './cancel-loan.service';

@Injectable()
export class CancelLoanListener extends BaseListener<CancelLoanDocument> {
  constructor(configService: ConfigService, service: CancelLoanService) {
    super(configService, service, service.queueCallbackName);
  }
}
