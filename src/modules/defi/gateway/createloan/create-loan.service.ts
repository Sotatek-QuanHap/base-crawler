import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/rabbitmq/base.service';
import { CreateLoan, CreateLoanDocument } from './create-loan.schema';
import { loadHash } from '../loadHash.service';

@Injectable()
export class CreateLoanService extends BaseService<CreateLoanDocument> {
  constructor(
    configService: ConfigService,
    @InjectModel(CreateLoan.name) createLoanModel: Model<CreateLoanDocument>,
    private loadHash: loadHash,
  ) {
    super(
      configService,
      configService.get<string>(
        'queue_create_loan'.toLocaleLowerCase(),
        'create-loan',
      ),
      configService.get<string>(
        'queue_create_loan_callback'.toLocaleLowerCase(),
        'create-loan-callback',
      ),
      createLoanModel,
    );
  }

  async processCreate(data: any): Promise<any> {
    const rs = await this.loadHash.getTransaction(data.hash);
    data.from = rs.from;
    return await super.processCreate(data);
  }
}
