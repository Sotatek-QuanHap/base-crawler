import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/rabbitmq/base.service';
import PaymentABI from './abis/payment.abi.json';
import { TransferSingleBaseHandle } from 'src/modules/defi/handles/transfer-single.base.handle';
import { PaymentService } from 'src/modules/defi/gateway/payment/payment.service';

@Injectable()
export class PaymentEthereumHandle extends TransferSingleBaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;

  constructor(configService: ConfigService, service: PaymentService) {
    super('PaymentApplied', configService, service);
    this.abi = PaymentABI;
    this.mappings = [
      { key: 'payer', convert: undefined },
      { key: 'pool', convert: undefined },
      { key: 'interestAmount', convert: undefined },
      { key: 'principalAmount', convert: undefined },
      { key: 'remainingAmount', convert: undefined },
      { key: 'reserveAmount', convert: undefined },
    ];
    this.logNames = ['PaymentApplied'];
  }
}
