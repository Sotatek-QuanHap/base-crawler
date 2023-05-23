import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseListener } from '../base.listener';
import { CreateFundDocument } from './create-fund.schema';
import { CreateFundService } from './create-fund.service';

@Injectable()
export class CreateFundListener extends BaseListener<CreateFundDocument> {
  constructor(configService: ConfigService, service: CreateFundService) {
    super(configService, service, service.queueCallbackName);
  }
}
