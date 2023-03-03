import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "src/rabbitmq/base.service";
import { CreateTranche, CreateTrancheDocument } from "./create-tranche.schema";

@Injectable()
export class CreateTrancheService extends BaseService<CreateTrancheDocument> {

  constructor(
    configService: ConfigService,
    @InjectModel(CreateTranche.name) createTrancheModel: Model<CreateTrancheDocument>,) {
    super(
      configService,
      configService.get<string>('queue_create_tranche'.toLocaleLowerCase(), 'create_tranche'),
      configService.get<string>('queue_create_tranche_callback'.toLocaleLowerCase(), 'create_tranche_callback'),
      createTrancheModel
    );
  }
}
