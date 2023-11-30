import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import DealCreatedAbi from './abis/deal-created.abi.json';
import { DealCreatedService } from 'src/modules/defi/gateway/deal-created/deal-created.service';

@Injectable()
export class DealCreatedEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;

  constructor(configService: ConfigService, service: DealCreatedService) {
    super('DealCreated', configService, service);
    this.abi = DealCreatedAbi;
    this.mappings = [
      { key: 'deal', convert: undefined },
      { key: 'dealWallet', convert: undefined },
      { key: 'dealManager', convert: undefined },
      { key: 'borrower', convert: undefined },
      { key: 'dbPrjId', convert: this.toNumber },
    ];
    this.logNames = ['DealCreated'];
  }
}
