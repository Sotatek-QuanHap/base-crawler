import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import InvestedABI from './abis/invested-fund.json';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import { InvestFundService } from 'src/modules/defi/gateway/invest-fund/invest-fund.service';

@Injectable()
export class InvestedFundEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;

  constructor(configService: ConfigService, service: InvestFundService) {
    super('Invested', configService, service);
    this.abi = InvestedABI;
    this.mappings = [
      { key: 'sender', convert: undefined },
      { key: 'fund', convert: undefined },
      { key: 'amount', convert: this.toNumber },
      { key: 'issuer', convert: undefined },
    ];
    this.logNames = ['Invested'];
  }
}
