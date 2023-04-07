import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import CloseLoan from './abis/close-loan.json';
import { CloseLoanService } from 'src/modules/defi/gateway/close-loan/close-loan.service';
@Injectable()
export class CloseLoanEthereumHandle extends TransferSingleBaseHandle {
  constructor(configService: ConfigService, service: CloseLoanService) {
    super('PoolClosed', configService, service);
    this.abi = CloseLoan;
    this.mappings = [];
    this.logNames = ['PoolClosed'];
  }
}
