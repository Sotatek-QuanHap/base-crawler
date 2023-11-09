import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';
import {
  RepaymentReceiptsConfirmed,
  RepaymentReceiptsConfirmedDocument,
} from './repayment-receipts-confirmed.schema';
import { LoadHash } from '../loadHash.service';

@Injectable()
export class RepaymentReceiptsConfirmedService extends BaseService<RepaymentReceiptsConfirmedDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(RepaymentReceiptsConfirmed.name)
    RepaymentReceiptsConfirmedModel: Model<RepaymentReceiptsConfirmedDocument>,
    private loadHash: LoadHash,
  ) {
    super(
      configService,
      configService.get<string>(
        'queue_repayment_receipts_confirmed'.toLocaleLowerCase(),
        'repayment-receipts-confirmed',
      ),
      configService.get<string>(
        'queue_repayment_receipts_confirmed_callback'.toLocaleLowerCase(),
        'repayment-receipts-confirmed-callback',
      ),
      RepaymentReceiptsConfirmedModel,
    );
  }

  async processCreate(data: any): Promise<any> {
    const rs = await this.loadHash.getTransaction(data.hash);
    data.from = rs.from;
    return await super.processCreate(data);
  }
}
