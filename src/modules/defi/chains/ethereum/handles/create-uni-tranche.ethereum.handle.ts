import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import UniTranchesCreatedABI from './abis/create-uni-tranche.abi.json';
import { CreateTrancheService } from 'src/modules/defi/gateway/createtranche/create-tranche.service';
@Injectable()
export class CreateUniTrancheEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;

  constructor(configService: ConfigService, service: CreateTrancheService) {
    super('UniTranchesCreated', configService, service);
    this.abi = UniTranchesCreatedABI;
    this.mappings = [{ key: 'uni', convert: undefined }];
    this.logNames = ['TranchesCreated'];
  }
}
