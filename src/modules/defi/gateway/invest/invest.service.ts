import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/rabbitmq/base.service";
import { Invest, InvestDocument } from "./invest.schema";

@Injectable()
export class InvestService extends BaseService<InvestDocument> {

  constructor(
    configService: ConfigService,
    @InjectModel(Invest.name) transferSingleModel: Model<InvestDocument>,) {
    super(
      configService,
      configService.get<string>('queue_invest'.toLocaleLowerCase(), 'invest'),
      configService.get<string>('queue_invest_callback'.toLocaleLowerCase(), 'invest_callback'),
      transferSingleModel
    );
  }
}
