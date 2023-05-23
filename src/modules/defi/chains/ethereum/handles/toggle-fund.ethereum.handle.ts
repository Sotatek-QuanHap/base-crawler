import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import ToggleFundABI from './abis/toggle-fund.json';
import { ToggleFundService } from 'src/modules/defi/gateway/togglefund/toggle-fund.service';

@Injectable()
export class ToggleFundEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;

  constructor(configService: ConfigService, service: ToggleFundService) {
    super('SetToggle', configService, service);
    this.abi = ToggleFundABI;
    this.mappings = [{ key: 'status', convert: undefined }];
    this.logNames = ['SetToggle'];
  }
}
