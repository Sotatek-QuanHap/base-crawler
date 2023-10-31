import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';
import { LoanCreated, LoanCreatedDocument } from './loan-created.schema';
import { LoadHash } from '../loadHash.service';

@Injectable()
export class LoanCreatedService extends BaseService<LoanCreatedDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(LoanCreated.name)
    loanCreatedModel: Model<LoanCreatedDocument>,
    private loadHash: LoadHash,
  ) {
    super(
      configService,
      configService.get<string>(
        'queue_loan_created'.toLocaleLowerCase(),
        'loan-created',
      ),
      configService.get<string>(
        'queue_loan_created_callback'.toLocaleLowerCase(),
        'loan-created-callback',
      ),
      loanCreatedModel,
    );
  }

  async processCreate(data: any): Promise<any> {
    const rs = await this.loadHash.getTransaction(data.hash);
    data.from = rs.from;
    return await super.processCreate(data);
  }
}
