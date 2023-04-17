import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import { TransferSingleService } from 'src/modules/defi/gateway/mintnft/transfer-single.service';
import TransferABI from './abis/transfer.abi.json';
@Injectable()
export class TransferSingleEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;
  constructor(configService: ConfigService, service: TransferSingleService) {
    super('TransferSingle', configService, service);
    this.mappings = [
      { key: 'operator', convert: undefined },
      { key: 'from', convert: undefined },
      { key: 'to', convert: undefined },
      { key: 'id', convert: undefined },
      { key: 'value', convert: undefined },
    ];
    this.abi = TransferABI;
  }
}
