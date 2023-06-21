import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import creatDividendPayment from './abis/creat-dividend-payment.abi.json';
import { CancelLoanService } from 'src/modules/defi/gateway/cancel-loan/cancel-loan.service';
@Injectable()
export class CreatDividendPaymentEthereumHandle extends TransferSingleBaseHandle {
  constructor(configService: ConfigService, service: CancelLoanService) {
    super('creatDividendPayment', configService, service);
    this.abi = creatDividendPayment;
    this.mappings = [
      { key: 'issuers', convert: undefined },
      { key: 'totalAmount', convert: this.toNumber },
      { key: 'historyLen', convert: undefined },
      { key: 'paymentType', convert: this.toNumber },
      { key: 'root', convert: undefined },
    ];
    this.logNames = ['creatDividendPayment'];
  }
}
