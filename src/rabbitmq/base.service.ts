import { ConfigService } from "@nestjs/config";
import { Model } from "mongoose";
import { Store } from "./store";

export abstract class BaseService<T> {
  protected queueName: string;
  public queueCallbackName: string;
  protected configService: ConfigService;
  protected model: Model<T>;

  constructor(configService: ConfigService, queueName: string, queueCallbackName: string, model: Model<T>) {
    this.queueCallbackName = queueCallbackName;
    this.queueName = queueName;
    this.configService = configService;
    this.model = model;
  }

  async processCreate(data: any): Promise<any> {
    console.log('process create: ', data);
    return await this.model.findOneAndUpdate({ chain: data.chain, hash: data.hash, logIndex: data.logIndex }, data, { upsert: true, new: true });
  }

  async create(data: any) {
    const rs = await this.processCreate(data);

    await Store.sendToQueue(this.queueName,
      Buffer.from(JSON.stringify({ ...rs.toObject(), queueCallbackName: this.queueCallbackName, _id: rs._id })),
      this.configService);
    await this.model.updateOne({ _id: rs._id, status: { $lt: 1 } }, { status: 1 });
  }

  async processUpdate(data: any): Promise<any> {
    const { _id, ...other } = data;
    delete other.turn;
    return await this.model.updateOne({ _id, status: { $lt: data.status } }, { $set: { ...other }, $inc: { turn: 1 } });
  }

  async update(data: any) {
    await this.processUpdate(data);
  }
}
