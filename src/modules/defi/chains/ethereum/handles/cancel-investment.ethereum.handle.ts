import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import CancelInvestmentABI from './abis/cancel-investment.abi.json';
import { CancelInvestmentService } from 'src/modules/defi/gateway/cancel-investment/cancel-investment.service';
@Injectable()
export class CancelInvestmentEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;

  constructor(configService: ConfigService, service: CancelInvestmentService) {
    super('Cancel', configService, service);
    this.abi = CancelInvestmentABI;
    this.mappings = [
      { key: 'account', convert: undefined },
      { key: 'subscriptionDate', convert: this.toNumber },
      { key: 'amount', convert: this.toNumber },
      { key: 'signingTime', convert: this.toNumber },
      { key: 'hashInfo', convert: undefined },
    ];
    this.logNames = ['Cancel'];
  }
}
