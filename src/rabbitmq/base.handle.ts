import { BlockWithTransactions, TransactionResponse, Log } from "@ethersproject/abstract-provider";
import { Interface, LogDescription, TransactionDescription } from "ethers/lib/utils";
import { ethers } from "ethers";
import { ConfigService } from "@nestjs/config";
import { TimeUtils } from "src/utils/time.utils";

export class BaseHandle {
  protected abi: any;
  public chain: string;
  protected inter: Interface;
  protected configService: ConfigService;
  protected inited: boolean = false;
  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  async loadConfig(): Promise<void> {
    console.log('load config')
  }

  async initHandle(): Promise<void> {
    if (this.inited)
      return;
    console.log('int handle', this.chain);
    while (true) {
      try {
        await this.loadConfig();
        break;
      } catch (error) {
        await TimeUtils.sleep((Math.random() * 3000 + 1000));
      }
    }
    this.initParse();
    this.inited = true;
  }

  initParse() {
    console.log('init parse of ', this.chain);
    this.inter = new ethers.utils.Interface(JSON.stringify(this.abi))
  }

  async handleTransactionParseSuccess(transactionDescription: TransactionDescription, transaction: TransactionResponse, block: BlockWithTransactions): Promise<void> {

  }

  async handleTransactionProcessError(error: any, transactionDescription: TransactionDescription, transaction: TransactionResponse, block: BlockWithTransactions): Promise<void> {
  }

  async handleTransactionParseError(error: any, transaction: TransactionResponse, block: BlockWithTransactions): Promise<void> {
  }

  async processTransaction(transaction: TransactionResponse, block: BlockWithTransactions): Promise<boolean> {
    try {
      const transactionDescription = this.inter.parseTransaction(transaction);
      try {
        await this.handleTransactionParseSuccess(transactionDescription, transaction, block);
      } catch (errorHandle) {
        await this.handleTransactionProcessError(errorHandle, transactionDescription, transaction, block);
      }
    } catch (error) {
      await this.handleTransactionParseError(error, transaction, block);
    }
    return false;
  }

  async processLog(log: Log, transaction: TransactionResponse, block: BlockWithTransactions): Promise<boolean> {
    try {
      const logDescription = this.inter.parseLog(log);
      try {
        await this.handleLogParseSuccess(logDescription, log, transaction, block);
      } catch (errorHandle) {
        await this.handleLogProcessError(errorHandle, logDescription, log, transaction, block);
      }
    } catch (error) {
      await this.handleLogParseError(error, log, transaction, block);
    }
    return false;
  }

  async handleLogParseSuccess(logDescription: LogDescription, log: Log, transaction: TransactionResponse, block: BlockWithTransactions): Promise<void> {

  }

  async handleLogProcessError(error: any, logDescription: LogDescription, log: Log, transaction: TransactionResponse, block: BlockWithTransactions): Promise<void> {
    // console.log('parse error ', logDescription);
  }

  async handleLogParseError(error: any, log: Log, transaction: TransactionResponse, block: BlockWithTransactions): Promise<void> {
    // console.log('handleLogParseError: ', error, log);
  }
}