import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/rabbitmq/base.service";
import { TransferSingle, TransferSingleDocument } from "./transfer-single.schema";

@Injectable()
export class TransferSingleService extends BaseService<TransferSingleDocument> {

  constructor(
    configService: ConfigService,
    @InjectModel(TransferSingle.name) transferSingleModel: Model<TransferSingleDocument>,) {
    super(
      configService,
      configService.get<string>('queue_transfer_single'.toLocaleLowerCase(), 'transfer-single'),
      configService.get<string>('queue_transfer_single_callback'.toLocaleLowerCase(), 'transfer-single-callback'),
      transferSingleModel
    );
  }
}
