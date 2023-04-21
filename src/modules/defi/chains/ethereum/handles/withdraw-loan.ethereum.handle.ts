import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import WithdrawABI from './abis/withdraw-loan.abi.json';
import { WithdrawService } from 'src/modules/defi/gateway/withdraw/withdraw-loan.service';
@Injectable()
export class WithdrawEthereumHandle extends TransferSingleBaseHandle {
  constructor(configService: ConfigService, service: WithdrawService) {
    super('WithdrawalMade', configService, service);
    this.abi = WithdrawABI;
    this.mappings = [
      { key: 'owner', convert: undefined },
      { key: 'tranche', convert: undefined },
      { key: 'trancheId', convert: this.toNumber },
      { key: 'interestWithdrawn', convert: this.toNumber },
      { key: 'principalWithdrawn', convert: this.toNumber },
    ];
    this.logNames = ['WithdrawalMade'];
  }
}
