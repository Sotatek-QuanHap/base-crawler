import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';
import { CreateFund, CreateFundDocument } from './create-fund.schema';
import { loadHash } from '../loadHash.service';

@Injectable()
export class CreateFundService extends BaseService<CreateFundDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(CreateFund.name) CreateFundModel: Model<CreateFundDocument>,
    private loadHash: loadHash,
  ) {
    super(
      configService,
      configService.get<string>(
        'queue_create_fund'.toLocaleLowerCase(),
        'create-fund',
      ),
      configService.get<string>(
        'queue_create_fund_callback'.toLocaleLowerCase(),
        'create-fund-callback',
      ),
      CreateFundModel,
    );
  }

  async processCreate(data: any): Promise<any> {
    const rs = await this.loadHash.getTransaction(data.hash);
    data.from = rs.from;
    return await super.processCreate(data);
  }
}
