import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import RepaymentReceiptsConfirmedAbi from './abis/repaymentBooked.json';
import { RepaymentReceiptsConfirmedService } from 'src/modules/defi/gateway/repayment-receipts-confirmed/repayment-receipts-confirmed.service';

@Injectable()
export class RepaymentReceiptsConfirmedHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;

  constructor(
    configService: ConfigService,
    service: RepaymentReceiptsConfirmedService,
  ) {
    super('RepaymentBooked', configService, service);
    this.abi = RepaymentReceiptsConfirmedAbi;
    this.mappings = [
      { key: 'txHash', convert: undefined },
      { key: 'investor', convert: undefined },
      { key: 'txType', convert: this.toNumber },
      { key: 'principalRepaid', convert: this.toNumber },
      { key: 'returnPaid', convert: this.toNumber },
    ];
    this.logNames = ['RepaymentBooked'];
  }
}
