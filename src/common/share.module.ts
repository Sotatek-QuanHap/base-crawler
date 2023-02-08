import { Module } from "@nestjs/common";
import { ConfigCrawler, ConfigCrawlerSchema } from "./configCrawlerService/configCrawler.schema";
import { DatabaseModule } from "./database/database.module";
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from "./transactions/models/transaction.schema";

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: ConfigCrawler.name, schema: ConfigCrawlerSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  exports: [
    DatabaseModule,
    MongooseModule,
  ],
})
export class ShareModule { }
