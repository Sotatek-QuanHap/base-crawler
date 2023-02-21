import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseListener } from "../base.listener";
import { CreateLoanDocument } from "./create-loan.schema";
import { CreateLoanService } from "./create-loan.service";

@Injectable()
export class CreateLoanListener extends BaseListener<CreateLoanDocument> {
  constructor(configService: ConfigService,
    service: CreateLoanService) {
    super(configService, service, service.queueCallbackName);
  }
}
