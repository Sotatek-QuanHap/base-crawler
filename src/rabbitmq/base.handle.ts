import { Block, TransactionResponse, Log } from "@ethersproject/abstract-provider";
import { Interface, LogDescription, TransactionDescription } from "ethers/lib/utils";
import { ethers, utils } from "ethers";
import { ConfigService } from "@nestjs/config";
import { TimeUtils } from "src/utils/time.utils";

export class BaseHandle {
  public abi: any;
  public chain: string;
  public inter: Interface;
  protected configService: ConfigService;
  protected inited: boolean = false;
  protected name: string;
  protected logNames: string[];
  constructor(name: string, configService: ConfigService) {
    this.configService = configService;
    this.name = name;
  }

  public toTopics(): any[] {
    if (!this.abi)
      return [];
    const rs = [];
    for (const element of this.abi) {
      if (element.type != 'event')
        continue;
      if (!this.logNames.includes(element.name)) {
        continue;
      }
      const params: string[] = [];
      for (const param of (element.inputs || [])) {
        params.push(param.type);
      }

      const eventInterface = `${element.name}(${params.join(',')})`;
      rs.push({ name: element.name, eventInterface, topic: utils.id(eventInterface) })
    }
    return rs;
  }

  public getLogNames(): string[] {
    return this.logNames;
  }

  public getName(): string {
    return this.name;
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

  async handleTransactionParseSuccess(transactionDescription: TransactionDescription, transaction: TransactionResponse, block: Block, chainId: number): Promise<boolean> {
    return false;
  }

  async handleTransactionProcessError(error: any, transactionDescription: TransactionDescription, transaction: TransactionResponse, block: Block, chainId: number): Promise<boolean> {
    return false;
  }

  async handleTransactionParseError(error: any, transaction: TransactionResponse, block: Block, chainId: number): Promise<boolean> {
    return false;
  }

  async processTransaction(transaction: TransactionResponse, block: Block, chainId: number): Promise<boolean> {
    try {
      const transactionDescription = this.inter.parseTransaction(transaction);
      try {
        return await this.handleTransactionParseSuccess(transactionDescription, transaction, block, chainId);
      } catch (errorHandle) {
        return await this.handleTransactionProcessError(errorHandle, transactionDescription, transaction, block, chainId);
      }
    } catch (error) {
      return await this.handleTransactionParseError(error, transaction, block, chainId);
    }
  }

  async processLog(log: Log, transaction: TransactionResponse, block: Block, sumary: any = {}, chainId: number): Promise<boolean> {
    // sumary[this.getName()].count = (sumary.count || 0) + 1;
    sumary[this.getName()] = sumary[this.getName()] || {};
    try {
      const logDescription = this.inter.parseLog(log);
      sumary[this.getName()].total = (sumary[this.getName()].total || 0) + 1;
      try {
        const isBreak = await this.handleLogParseSuccess(logDescription, log, transaction, block, chainId);
        sumary[this.getName()].success = (sumary[this.getName()].success || 0) + 1;
        return isBreak;
      } catch (errorHandle) {
        // sumary[this.getName()].processError = (sumary.processError || 0) + 1;
        return await this.handleLogProcessError(errorHandle, logDescription, log, transaction, block, chainId);
      }
    } catch (error) {
      // sumary[this.getName()].parseError = (sumary.parseError || 0) + 1;
      return await this.handleLogParseError(error, log, transaction, block, chainId);
    }
  }

  async handleLogParseSuccess(logDescription: LogDescription, log: Log, transaction: TransactionResponse, block: Block, chainId: number): Promise<boolean> {
    return false;
  }

  async handleLogProcessError(error: any, logDescription: LogDescription, log: Log, transaction: TransactionResponse, block: Block, chainId: number): Promise<boolean> {
    // console.log('parse error ', logDescription);
    return false;
  }

  async handleLogParseError(error: any, log: Log, transaction: TransactionResponse, block: Block, chainId: number): Promise<boolean> {
    // console.log('handleLogParseError: ', error, log);
    return false;
  }
}