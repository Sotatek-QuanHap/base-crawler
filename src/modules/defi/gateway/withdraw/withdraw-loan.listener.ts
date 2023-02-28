import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseListener } from "../base.listener";
import { WithdrawDocument } from "./withdraw-loan.schema";
import { WithdrawService } from "./withdraw-loan.service";

@Injectable()
export class WithdrawListener extends BaseListener<WithdrawDocument> {
  constructor(configService: ConfigService,
    service: WithdrawService) {
    super(configService, service, service.queueCallbackName);
  }
}
