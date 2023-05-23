import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseListener } from '../base.listener';
import { ToggleFundDocument } from './toggle-fund.schema';
import { ToggleFundService } from './toggle-fund.service';

@Injectable()
export class ToggleFundListener extends BaseListener<ToggleFundDocument> {
  constructor(configService: ConfigService, service: ToggleFundService) {
    super(configService, service, service.queueCallbackName);
  }
}
