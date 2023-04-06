import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import MultiTranchesCreatedABI from './abis/create-multi-tranche.abi.json';
import { CreateTrancheService } from 'src/modules/defi/gateway/createtranche/create-tranche.service';
@Injectable()
export class CreateMultiTrancheEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;

  constructor(configService: ConfigService, service: CreateTrancheService) {
    super('MultiTranchesCreated', configService, service);
    this.abi = MultiTranchesCreatedABI;
    this.mappings = [
      { key: 'junior', convert: undefined },
      { key: 'senior', convert: undefined },
    ];
    this.logNames = ['TranchesCreated'];
  }
}
