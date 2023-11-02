import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseListener } from '../base.listener';
import { InvestedService } from './invested.service';
import { InvestedDocument } from './invested.schema';

@Injectable()
export class InvestedListener extends BaseListener<InvestedDocument> {
  constructor(configService: ConfigService, service: InvestedService) {
    super(configService, service, service.queueCallbackName);
  }
}
