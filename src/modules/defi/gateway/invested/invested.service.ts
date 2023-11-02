import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';
import { Invested, InvestedDocument } from './invested.schema';

@Injectable()
export class InvestedService extends BaseService<InvestedDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(Invested.name)
    investedModel: Model<InvestedDocument>,
  ) {
    super(
      configService,
      configService.get<string>(
        'queue_invested'.toLocaleLowerCase(),
        'invested',
      ),
      configService.get<string>(
        'queue_invested_callback'.toLocaleLowerCase(),
        'invested-callback',
      ),
      investedModel,
    );
  }
}
