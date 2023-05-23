import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import FundCreatedABI from './abis/create-fund.json';
import { CreateFundService } from 'src/modules/defi/gateway/createfund/create-fund.service';

@Injectable()
export class CreateFundEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;

  constructor(configService: ConfigService, service: CreateFundService) {
    super('FundCreated', configService, service);
    this.abi = FundCreatedABI;
    this.mappings = [
      { key: 'fund', convert: undefined },
      { key: 'issuer', convert: undefined },
      { key: 'dbPrjId', convert: undefined },
    ];
    this.logNames = ['FundCreated'];
  }
}
