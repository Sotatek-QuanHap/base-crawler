import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import InvestABI from './abis/invest.abi.json';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import { InvestService } from 'src/modules/defi/gateway/invest/invest.service';
@Injectable()
export class InvestEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;

  constructor(configService: ConfigService, service: InvestService) {
    super('DepositMade', configService, service);
    this.abi = InvestABI;
    this.mappings = [
      { key: 'owner', convert: undefined },
      { key: 'tranche', convert: undefined },
      { key: 'trancheId', convert: undefined },
      { key: 'amount', convert: undefined },
    ];
    this.logNames = ['DepositMade'];
  }
}
