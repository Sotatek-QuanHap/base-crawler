import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import PoolCreatedABI from './abis/create-loan.json';
import { CreateLoanService } from 'src/modules/defi/gateway/createloan/create-loan.service';
@Injectable()
export class CreateLoanEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;

  constructor(configService: ConfigService, service: CreateLoanService) {
    super('PoolCreated', configService, service);
    this.abi = PoolCreatedABI;
    this.mappings = [
      { key: 'pool', convert: undefined },
      { key: 'borrower', convert: undefined },
    ];
    this.logNames = ['PoolCreated'];
  }
}
