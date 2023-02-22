import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/rabbitmq/base.service";
import { LinkProxy, LinkProxyDocument } from "./link-proxy.schema";

@Injectable()
export class LinkProxyService extends BaseService<LinkProxyDocument> {

  constructor(
    configService: ConfigService,
    @InjectModel(LinkProxy.name) linkProxyModel: Model<LinkProxyDocument>,) {
    super(
      configService,
      configService.get<string>('queue_link_proxy'.toLocaleLowerCase(), 'link_proxy'),
      configService.get<string>('queue_link_proxy_callback'.toLocaleLowerCase(), 'link_proxy_callback'),
      linkProxyModel
    );
  }
}
