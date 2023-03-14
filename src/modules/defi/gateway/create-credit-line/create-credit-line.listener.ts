import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseListener } from '../base.listener';
import { CreateCreditLineDocument } from './create-credit-line.schema';
import { CreateCreditLineService } from './create-credit-line.service';

@Injectable()
export class CreateCreditLineListener extends BaseListener<CreateCreditLineDocument> {
  constructor(configService: ConfigService, service: CreateCreditLineService) {
    super(configService, service, service.queueCallbackName);
  }
}
