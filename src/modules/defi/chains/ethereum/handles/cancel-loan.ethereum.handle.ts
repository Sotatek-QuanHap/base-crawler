import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import CancelLoanABI from './abis/cancel-loan.json';
import { CancelLoanService } from 'src/modules/defi/gateway/cancel-loan/cancel-loan.service';
@Injectable()
export class CancelLoanEthereumHandle extends TransferSingleBaseHandle {
  constructor(configService: ConfigService, service: CancelLoanService) {
    super('PoolCancelled', configService, service);
    this.abi = CancelLoanABI;
    this.mappings = [];
    this.logNames = ['PoolCancelled'];
  }
}
