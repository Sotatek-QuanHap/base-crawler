import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseListener } from '../base.listener';
import { DealCreatedService } from './deal-created.service';
import { DealCreatedDocument } from './deal-created.schema';

@Injectable()
export class DealCreatedListener extends BaseListener<DealCreatedDocument> {
  constructor(configService: ConfigService, service: DealCreatedService) {
    super(configService, service, service.queueCallbackName);
  }
}
