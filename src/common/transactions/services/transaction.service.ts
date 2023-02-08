import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Store } from "src/rabbitmq/store";
import { Transaction, TransactionDocument } from "../models/transaction.schema";

@Injectable()
export class TransactionService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) { }

  async addTransaction(transaction: any) {
    console.log('add transaction: ', transaction);
    const rs = await this.transactionModel.create(transaction);
    //Send to rabbit mq
    if (rs.action == 'deposited') {
      const channal = await Store.getChannel('deposited', this.configService);
      channal.sendToQueue('deposited', Buffer.from(JSON.stringify({
        _id: rs._id,
        data: {
          from: rs.from,
          to: rs.to,
          action: rs.action,
          hash: rs.hash,
          address: rs.address,
          amount: rs.value,
          chain: rs.chain,
          key: `deposited.${rs.from}.${rs.hash}`,
        }
      })));
    }

    //Update transaction event
    await this.transactionModel.findOneAndUpdate({ _id: rs._id, sendWalletSuccess: false }, { $inc: { retrySendWalletTurn: 1 } });
  }
}
