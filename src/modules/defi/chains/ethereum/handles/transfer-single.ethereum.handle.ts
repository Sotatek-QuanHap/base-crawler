import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseService } from "src/rabbitmq/base.service";
import { TransferSingleBaseHandle } from "src/modules/defi/handles/transfer-single.base.handle";
import { TransferSingleService } from "src/modules/defi/gateway/mintnft/transfer-single.service";
import TransferABI from "./transfer.abi.json";
@Injectable()
export class TransferSingleEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;
  protected mappings = [
    { key: 'operator', convert: undefined },
    { key: 'from', convert: undefined },
    { key: 'to', convert: undefined },
    { key: 'id', convert: undefined },
    { key: 'value', convert: undefined },
  ];
  constructor(configService: ConfigService, service: TransferSingleService) {
    super('TransferSingleEthereumHandle', configService, service);
    this.abi = TransferABI;
  }
}
