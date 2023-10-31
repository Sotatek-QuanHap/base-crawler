import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import LoanCreatedAbi from './abis/loan-created.abi.json';
import { LoanCreatedService } from 'src/modules/defi/gateway/loan-created/loan-created.service';

@Injectable()
export class LoanCreatedEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;

  constructor(configService: ConfigService, service: LoanCreatedService) {
    super('LoanCreated', configService, service);
    this.abi = LoanCreatedAbi;
    this.mappings = [
      { key: 'loan', convert: undefined },
      { key: 'loanWallet', convert: undefined },
      { key: 'loanManager', convert: undefined },
      { key: 'borrower', convert: undefined },
      { key: 'dbPrjId', convert: this.toNumber },
    ];
    this.logNames = ['LoanCreated'];
  }
}
