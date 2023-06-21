import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import indirectDividendPaymentABI from './abis/indirect-dividend-payment.abi.json';
import { CancelLoanService } from 'src/modules/defi/gateway/cancel-loan/cancel-loan.service';
@Injectable()
export class IndirectDividendPaymentEthereumHandle extends TransferSingleBaseHandle {
  constructor(configService: ConfigService, service: CancelLoanService) {
    super('indirectDividendPayment', configService, service);
    this.abi = indirectDividendPaymentABI;
    this.mappings = [
      { key: 'root', convert: undefined },
      { key: '_issuer', convert: undefined },
      { key: 'totalAmount', convert: this.toNumber },
    ];
    this.logNames = ['indirectDividendPayment'];
  }
}
