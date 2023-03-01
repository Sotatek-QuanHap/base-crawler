import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseListener } from "../base.listener";
import { InvestDocument } from "./invest.schema";
import { InvestService } from "./invest.service";

@Injectable()
export class InvestListener extends BaseListener<InvestDocument> {
  constructor(configService: ConfigService,
    service: InvestService) {
    super(configService, service, service.queueCallbackName);
  }
}
