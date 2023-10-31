import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseListener } from '../base.listener';
import { LoanCreatedService } from './loan-created.service';
import { LoanCreatedDocument } from './loan-created.schema';

@Injectable()
export class LoanCreatedListener extends BaseListener<LoanCreatedDocument> {
  constructor(configService: ConfigService, service: LoanCreatedService) {
    super(configService, service, service.queueCallbackName);
  }
}
