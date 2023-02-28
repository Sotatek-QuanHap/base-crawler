import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/rabbitmq/base.service";
import { Withdraw, WithdrawDocument } from "./withdraw-loan.schema";

@Injectable()
export class WithdrawService extends BaseService<WithdrawDocument> {

  constructor(
    configService: ConfigService,
    @InjectModel(Withdraw.name) withdrawModel: Model<WithdrawDocument>,) {
    super(
      configService,
      configService.get<string>('queue_withdraw'.toLocaleLowerCase(), 'withdraw'),
      configService.get<string>('queue_withdraw_callback'.toLocaleLowerCase(), 'withdraw-callback'),
      withdrawModel
    );
  }
}
