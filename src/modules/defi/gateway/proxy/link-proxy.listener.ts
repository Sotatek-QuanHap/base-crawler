import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseListener } from "../base.listener";
import { LinkProxyDocument } from "./link-proxy.schema";
import { LinkProxyService } from "./link-proxy.service";

@Injectable()
export class LinkProxyListener extends BaseListener<LinkProxyDocument> {
  constructor(configService: ConfigService,
    service: LinkProxyService) {
    super(configService, service, service.queueCallbackName);
  }
}
