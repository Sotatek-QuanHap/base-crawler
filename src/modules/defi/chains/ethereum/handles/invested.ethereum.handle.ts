import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import InvestedAbi from './abis/invested.abi.json';
import { InvestedService } from 'src/modules/defi/gateway/invested/invested.service';

@Injectable()
export class InvestedEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;

  constructor(configService: ConfigService, service: InvestedService) {
    super('Invested', configService, service);
    this.abi = InvestedAbi;
    this.mappings = [
      { key: 'investor', convert: undefined },
      { key: 'fund', convert: undefined },
      { key: 'investmentDate', convert: this.toNumber },
      { key: 'amount', convert: this.toNumber },
      { key: 'salt', convert: this.toNumber },
      { key: 'expirationTime', convert: this.toNumber },
      { key: 'loanWallet', convert: undefined },
      { key: 'investmentHash', convert: undefined },
    ];
    this.logNames = ['Invested'];
  }
}
