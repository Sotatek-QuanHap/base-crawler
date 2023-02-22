import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseService } from "src/rabbitmq/base.service";
import FactoryABI from "./factory.abi.json";
import { LinkProxyService } from "src/modules/defi/gateway/proxy/link-proxy.service";
import { LinkProxyBaseHandle } from "src/modules/defi/handles/link-proxy.base.handle";
@Injectable()
export class LinkProxyEthereumHandle extends LinkProxyBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;
  protected mappings = [
    { key: 'borrower', convert: undefined },
    { key: 'owner', convert: undefined },
  ];
  constructor(configService: ConfigService, service: LinkProxyService) {
    super('BorrowerCreated', configService, service);
    this.abi = FactoryABI;
  }
}
