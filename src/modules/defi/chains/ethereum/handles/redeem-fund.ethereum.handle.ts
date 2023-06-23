import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import RedeemFundAbi from './abis/redeem-fund.json';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import { RedeemFundService } from 'src/modules/defi/gateway/redeem-fund/redeem-fund.service';

@Injectable()
export class RedeemFundEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;

  constructor(configService: ConfigService, service: RedeemFundService) {
    super('Claimed', configService, service);
    this.abi = RedeemFundAbi;
    this.mappings = [
      { key: 'investor', convert: undefined },
      { key: 'claimableAmount', convert: this.toNumber },
      { key: 'checkPointIdx', convert: this.toNumber },
    ];
    this.logNames = ['Claimed'];
  }
}
