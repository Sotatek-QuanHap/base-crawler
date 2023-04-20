import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';
import { CancelLoan, CancelLoanDocument } from './cancel-loan.schema';
import { loadHash } from '../loadHash.service';

@Injectable()
export class CancelLoanService extends BaseService<CancelLoanDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(CancelLoan.name) cancelLoanModel: Model<CancelLoanDocument>,
    private loadHash: loadHash,
  ) {
    super(
      configService,
      configService.get<string>(
        'queue_cancel-loan'.toLocaleLowerCase(),
        'cancel-loan',
      ),
      configService.get<string>(
        'queue_cancel-loan_callback'.toLocaleLowerCase(),
        'cancel-loan-callback',
      ),
      cancelLoanModel,
    );
  }
  async processCreate(data: any): Promise<any> {
    const rs = await this.loadHash.getTransaction(data.hash);
    data.from = rs.from;
    return await super.processCreate(data);
  }
}
