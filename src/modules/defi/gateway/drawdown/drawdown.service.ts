import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';
import { Drawdown, DrawdownDocument } from './drawdown.schema';

@Injectable()
export class DrawdownService extends BaseService<DrawdownDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(Drawdown.name) drawdownModel: Model<DrawdownDocument>,
  ) {
    super(
      configService,
      configService.get<string>(
        'queue_drawdown'.toLocaleLowerCase(),
        'drawdown',
      ),
      configService.get<string>(
        'queue_drawdown_callback'.toLocaleLowerCase(),
        'drawdown-callback',
      ),
      drawdownModel,
    );
  }
}
