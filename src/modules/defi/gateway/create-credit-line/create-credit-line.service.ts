import {
  CreateCreditLine,
  CreateCreditLineDocument,
} from './create-credit-line.schema';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';

@Injectable()
export class CreateCreditLineService extends BaseService<CreateCreditLineDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(CreateCreditLine.name)
    createCreditLineModel: Model<CreateCreditLineDocument>,
  ) {
    super(
      configService,
      configService.get<string>(
        'queue_create_credit_line'.toLocaleLowerCase(),
        'create-credit-line',
      ),
      configService.get<string>(
        'queue_create_credit_line_callback'.toLocaleLowerCase(),
        'create-credit-line-callback',
      ),
      createCreditLineModel,
    );
  }
}
