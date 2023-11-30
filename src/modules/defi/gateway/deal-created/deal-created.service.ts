import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';
import { DealCreated, DealCreatedDocument } from './deal-created.schema';
import { LoadHash } from '../loadHash.service';

@Injectable()
export class DealCreatedService extends BaseService<DealCreatedDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(DealCreated.name)
    dealCreatedModel: Model<DealCreatedDocument>,
    private loadHash: LoadHash,
  ) {
    super(
      configService,
      configService.get<string>(
        'queue_deal_created'.toLocaleLowerCase(),
        'deal-created',
      ),
      configService.get<string>(
        'queue_deal_created_callback'.toLocaleLowerCase(),
        'deal-created-callback',
      ),
      dealCreatedModel,
    );
  }

  async processCreate(data: any): Promise<any> {
    const rs = await this.loadHash.getTransaction(data.hash);
    data.from = rs.from;
    return await super.processCreate(data);
  }
}
