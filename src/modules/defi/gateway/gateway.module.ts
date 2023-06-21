import { WithdrawListener } from './withdraw/withdraw-loan.listener';
import { Withdraw, WithdrawSchema } from './withdraw/withdraw-loan.schema';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ShareModule } from 'src/common/share.module';
import { CreateLoanListener } from './createloan/create-loan.listener';
import { CreateLoan, CreateLoanSchema } from './createloan/create-loan.schema';
import { CreateLoanService } from './createloan/create-loan.service';
import { TransferSingleListener } from './mintnft/transfer-single.listener';
import {
  TransferSingle,
  TransferSingleSchema,
} from './mintnft/transfer-single.schema';
import { TransferSingleService } from './mintnft/transfer-single.service';
import { LinkProxyListener } from './proxy/link-proxy.listener';
import { LinkProxy, LinkProxySchema } from './proxy/link-proxy.schema';
import { LinkProxyService } from './proxy/link-proxy.service';
import { WithdrawService } from './withdraw/withdraw-loan.service';
import { Invest, InvestSchema } from './invest/invest.schema';
import { InvestService } from './invest/invest.service';
import { InvestListener } from './invest/invest.listener';
import {
  CreateTranche,
  CreateTrancheSchema,
} from './createtranche/create-tranche.schema';
import { CreateTrancheService } from './createtranche/create-tranche.service';
import { CreateTrancheListener } from './createtranche/create-tranche.listener';
import { DrawdownService } from './drawdown/drawdown.service';
import { DrawdownListener } from './drawdown/drawdown.listener';
import { Drawdown, DrawdownSchema } from './drawdown/drawdown.schema';
import { CancelLoan, CancelLoanSchema } from './cancel-loan/cancel-loan.schema';
import { CancelLoanListener } from './cancel-loan/cancel-loan.listener';
import { CancelLoanService } from './cancel-loan/cancel-loan.service';
import {
  CreateCreditLine,
  CreateCreditLineSchema,
} from './create-credit-line/create-credit-line.schema';
import { CreateCreditLineService } from './create-credit-line/create-credit-line.service';
import { CreateCreditLineListener } from './create-credit-line/create-credit-line.listener';
import { Payment, PaymentSchema } from './payment/payment.schema';
import { PaymentService } from './payment/payment.service';
import { PaymentListener } from './payment/payment.listener';
import { loadHash } from './loadHash.service';
import { CloseLoan, CloseLoanSchema } from './close-loan/close-loan.schema';
import { CloseLoanService } from './close-loan/close-loan.service';
import { CloseLoanListener } from './close-loan/close-loan.listener';
import { CreateFundService } from './createfund/create-fund.service';
import { CreateFundListener } from './createfund/create-fund.listener';
import { CreateFund, CreateFundSchema } from './createfund/create-fund.schema';
import { ToggleFund, ToggleFundSchema } from './togglefund/toggle-fund.schema';
import { ToggleFundService } from './togglefund/toggle-fund.service';
import { ToggleFundListener } from './togglefund/toggle-fund.listener';
import { InvestFund, InvestFundSchema } from './invest-fund/invest-fund.schema';
import { InvestFundService } from './invest-fund/invest-fund.service';
import {
  CreatDividendPayment,
  CreatDividendPaymentSchema,
} from './creat-dividend-payment/creat-dividend-payment.schema';
import { CreatDividendPaymentListener } from './creat-dividend-payment/creat-dividend-payment.listener';
import { CreatDividendPaymentService } from './creat-dividend-payment/creat-dividend-payment.service';

@Module({
  imports: [
    ShareModule,
    MongooseModule.forFeature([
      { name: TransferSingle.name, schema: TransferSingleSchema },
      { name: CreateLoan.name, schema: CreateLoanSchema },
      { name: LinkProxy.name, schema: LinkProxySchema },
      { name: Withdraw.name, schema: WithdrawSchema },
      { name: Drawdown.name, schema: DrawdownSchema },
      { name: Invest.name, schema: InvestSchema },
      { name: CreateTranche.name, schema: CreateTrancheSchema },
      { name: CancelLoan.name, schema: CancelLoanSchema },
      { name: CreateCreditLine.name, schema: CreateCreditLineSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: CloseLoan.name, schema: CloseLoanSchema },
      { name: CreateFund.name, schema: CreateFundSchema },
      { name: ToggleFund.name, schema: ToggleFundSchema },
      { name: InvestFund.name, schema: InvestFundSchema },
      {
        name: CreatDividendPayment.name,
        schema: CreatDividendPaymentSchema,
      },
    ]),
  ],
  providers: [
    ConfigService,
    TransferSingleService,
    TransferSingleListener,
    CreateLoanService,
    CreateLoanListener,
    LinkProxyService,
    LinkProxyListener,
    WithdrawService,
    WithdrawListener,
    DrawdownService,
    DrawdownListener,
    InvestService,
    InvestListener,
    CreateTrancheListener,
    CreateTrancheService,
    CancelLoanListener,
    CancelLoanService,
    CreateCreditLineService,
    CreateCreditLineListener,
    PaymentService,
    PaymentListener,
    loadHash,
    CloseLoanService,
    CloseLoanListener,
    CreateFundService,
    CreateFundListener,
    ToggleFundService,
    ToggleFundListener,
    InvestFundService,
    InvestListener,
    CreatDividendPaymentListener,
    CreatDividendPaymentService,
  ],
  exports: [
    TransferSingleService,
    CreateLoanService,
    LinkProxyService,
    WithdrawService,
    DrawdownService,
    InvestService,
    CreateTrancheService,
    CancelLoanService,
    CreateCreditLineService,
    PaymentService,
    CloseLoanService,
    CreateFundService,
    ToggleFundService,
    InvestFundService,
    CreatDividendPaymentService,
  ],
})
export class GatewayModule {
  // constructor(private transferSingleListener: TransferSingleListener) {
  //   this.transferSingleListener.listen();
  // }
}
