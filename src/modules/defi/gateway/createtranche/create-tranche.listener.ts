import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseListener } from "../base.listener";
import { CreateTrancheDocument } from "./create-tranche.schema";
import { CreateTrancheService } from "./create-tranche.service";

@Injectable()
export class CreateTrancheListener extends BaseListener<CreateTrancheDocument> {
  constructor(configService: ConfigService,
    service: CreateTrancheService) {
    super(configService, service, service.queueCallbackName);
  }
}
