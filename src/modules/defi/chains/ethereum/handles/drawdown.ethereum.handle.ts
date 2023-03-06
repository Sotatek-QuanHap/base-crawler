import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import Drawdown from './abis/drawdown.json';
import { DrawdownService } from 'src/modules/defi/gateway/drawdown/drawdown.service';
@Injectable()
export class DrawdownEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;

  constructor(configService: ConfigService, service: DrawdownService) {
    super('DrawdownMade', configService, service);
    this.abi = Drawdown;
    this.mappings = [
      { key: 'borrower', convert: undefined },
      { key: 'amount', convert: undefined },
    ];
    this.logNames = ['DrawdownMade'];
  }
}
