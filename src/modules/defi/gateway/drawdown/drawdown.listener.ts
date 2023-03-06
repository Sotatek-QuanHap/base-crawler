import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseListener } from '../base.listener';
import { DrawdownDocument } from './drawdown.schema';
import { DrawdownService } from './drawdown.service';

@Injectable()
export class DrawdownListener extends BaseListener<DrawdownDocument> {
  constructor(configService: ConfigService, service: DrawdownService) {
    super(configService, service, service.queueCallbackName);
  }
}
