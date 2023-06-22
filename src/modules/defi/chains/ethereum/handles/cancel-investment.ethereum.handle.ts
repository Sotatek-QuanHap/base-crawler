import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import CancelInvestmentABI from './abis/cancel-investment.abi.json';
import { CreateLoanService } from 'src/modules/defi/gateway/createloan/create-loan.service';
@Injectable()
export class CancelInvestmentEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;

  constructor(configService: ConfigService, service: CreateLoanService) {
    super('Cancel', configService, service);
    this.abi = CancelInvestmentABI;
    this.mappings = [
      { key: 'account', convert: undefined },
      { key: 'nonce', convert: this.toNumber },
    ];
    this.logNames = ['Cancel'];
  }
}
