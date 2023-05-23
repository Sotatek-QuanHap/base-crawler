import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';
import { ToggleFund, ToggleFundDocument } from './toggle-fund.schema';

@Injectable()
export class ToggleFundService extends BaseService<ToggleFundDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(ToggleFund.name) ToggleFundModel: Model<ToggleFundDocument>,
  ) {
    super(
      configService,
      configService.get<string>(
        'queue_toggle_fund'.toLocaleLowerCase(),
        'toggle-fund',
      ),
      configService.get<string>(
        'queue_toggle_fund_callback'.toLocaleLowerCase(),
        'toggle-fund-callback',
      ),
      ToggleFundModel,
    );
  }
}
