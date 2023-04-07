import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';
import { CloseLoan, CloseLoanDocument } from './close-loan.schema';
import { loadHash } from '../loadHash.service';

@Injectable()
export class CloseLoanService extends BaseService<CloseLoanDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(CloseLoan.name) CloseLoanModel: Model<CloseLoanDocument>,
    private loadHash: loadHash,
  ) {
    super(
      configService,
      configService.get<string>(
        'queue_close_loan'.toLocaleLowerCase(),
        'close-loan',
      ),
      configService.get<string>(
        'queue_close_loan_callback'.toLocaleLowerCase(),
        'close-loan-callback',
      ),
      CloseLoanModel,
    );
  }
  async processCreate(data: any): Promise<any> {
    const rs = await this.loadHash.getTransaction(data.hash);
    data.from = rs.from;
    return await super.processCreate(data);
  }
}
