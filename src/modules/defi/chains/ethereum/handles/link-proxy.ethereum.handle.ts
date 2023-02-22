import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import FactoryABI from './factory.abi.json';
import { LinkProxyService } from 'src/modules/defi/gateway/proxy/link-proxy.service';
import { LinkProxyBaseHandle } from 'src/modules/defi/handles/link-proxy.base.handle';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import { TransferSingleService } from 'src/modules/defi/gateway/mintnft/transfer-single.service';
@Injectable()
export class LinkProxyEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;
  protected mappings = [
    { key: 'borrower', convert: undefined },
    { key: 'owner', convert: undefined },
  ];
  constructor(configService: ConfigService, service: TransferSingleService) {
    super('BorrowerCreated', configService, service);
    this.abi = FactoryABI;
  }
}
