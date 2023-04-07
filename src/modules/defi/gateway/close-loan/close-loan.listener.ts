import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseListener } from '../base.listener';
import { CloseLoanDocument } from './close-loan.schema';
import { CloseLoanService } from './close-loan.service';

@Injectable()
export class CloseLoanListener extends BaseListener<CloseLoanDocument> {
  constructor(configService: ConfigService, service: CloseLoanService) {
    super(configService, service, service.queueCallbackName);
  }
}
