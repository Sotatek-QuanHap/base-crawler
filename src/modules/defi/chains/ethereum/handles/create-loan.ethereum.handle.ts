import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseService } from "src/rabbitmq/base.service";
import { TransferSingleBaseHandle } from "src/modules/defi/handles/transfer-single.base.handle";
import { TransferSingleService } from "src/modules/defi/gateway/mintnft/transfer-single.service";
import FactoryABI from './factory.abi.json'
@Injectable()
export class CreateLoanEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;
  protected mappings = [
    { key: 'pool', convert: undefined },
    { key: 'borrower', convert: undefined },
  ];
  constructor(configService: ConfigService, service: TransferSingleService) {
    super('PoolCreated', configService, service);
    this.abi = FactoryABI;
    this.logNames = ['PoolCreated'];
  }
}
