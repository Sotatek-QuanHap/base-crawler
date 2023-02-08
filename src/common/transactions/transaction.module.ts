import { Module } from "@nestjs/common";
import { ShareModule } from "../share.module";
import { TransactionService } from "./services/transaction.service";

@Module({
  imports: [ShareModule],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule { }
