import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseListener } from "../base.listener";
import { TransferSingleDocument } from "./transfer-single.schema";
import { TransferSingleService } from "./transfer-single.service";

@Injectable()
export class TransferSingleListener extends BaseListener<TransferSingleDocument> {
  constructor(configService: ConfigService,
    service: TransferSingleService) {
    super(configService, service, service.queueCallbackName);
  }
}
