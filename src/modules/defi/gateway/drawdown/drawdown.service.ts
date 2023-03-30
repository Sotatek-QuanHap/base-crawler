import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';
import { Drawdown, DrawdownDocument } from './drawdown.schema';
import { loadHash } from '../loadHash.service';

@Injectable()
export class DrawdownService extends BaseService<DrawdownDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(Drawdown.name) drawdownModel: Model<DrawdownDocument>,
    private loadHash: loadHash,
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
  async processCreate(data: any): Promise<any> {
    const rs = await this.loadHash.getTransaction(data.hash);
    data.from = rs.from;
    return await super.processCreate(data);
  }
}
