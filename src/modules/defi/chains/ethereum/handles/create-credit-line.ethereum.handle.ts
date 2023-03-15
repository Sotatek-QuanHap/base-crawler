import { CreateCreditLineService } from './../../../gateway/create-credit-line/create-credit-line.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import CreateCreditLineABI from './abis/create-credit-line.json';
@Injectable()
export class CreateCreditLineHandle extends TransferSingleBaseHandle {
  constructor(configService: ConfigService, service: CreateCreditLineService) {
    super('CreditLineCreated', configService, service);
    this.abi = CreateCreditLineABI;
    this.mappings = [{ key: 'creditLine', convert: undefined }];
    this.logNames = ['CreditLineCreated'];
  }
}
