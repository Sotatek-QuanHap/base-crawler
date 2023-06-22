import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import creatDividendPaymentABI from './abis/creat-dividend-payment.abi.json';
import { CancelLoanService } from 'src/modules/defi/gateway/cancel-loan/cancel-loan.service';
@Injectable()
export class CreatDividendPaymentEthereumHandle extends TransferSingleBaseHandle {
  constructor(configService: ConfigService, service: CancelLoanService) {
    super('CreatedDividendPayment', configService, service);
    this.abi = creatDividendPaymentABI;
    this.mappings = [
      { key: 'issuer', convert: undefined },
      { key: 'totalAmount', convert: this.toNumber },
      { key: 'historyLen', convert: this.toNumber },
      { key: 'paymentType', convert: this.toNumber },
      { key: 'root', convert: undefined },
      { key: 'uuid', convert: this.toNumber },
    ];
    this.logNames = ['CreatedDividendPayment'];
  }
}
