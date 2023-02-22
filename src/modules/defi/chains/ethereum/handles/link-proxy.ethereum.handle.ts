import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import LinkProxyABI from './link-proxy.json';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import { LinkProxyService } from 'src/modules/defi/gateway/proxy/link-proxy.service';
@Injectable()
export class LinkProxyEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;

  constructor(configService: ConfigService, service: LinkProxyService) {
    super('BorrowerCreated', configService, service);
    this.abi = LinkProxyABI;
    this.mappings = [
      { key: 'borrower', convert: undefined },
      { key: 'owner', convert: undefined },
    ];
    this.logNames = ['BorrowerCreated'];
  }
}
