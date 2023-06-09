import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseHandle } from "src/rabbitmq/base.handle";
import { Log, TransactionResponse, Block } from "@ethersproject/abstract-provider";
import { LogDescription } from "ethers/lib/utils";
import { TransferSingleService } from "../gateway/mintnft/transfer-single.service";
import { BaseService } from "src/rabbitmq/base.service";
import { BigNumber } from "ethers";

@Injectable()
export class TransferSingleBaseHandle extends BaseHandle {
  protected service: BaseService<any>;
  protected mappings = [

  ];
  constructor(name: string, configService: ConfigService, service: any) {
    super(name, configService);
    this.service = service;
    this.logNames = ['TransferSingle'];
    this.mappings = [
      { key: 'operator', convert: undefined },
      { key: 'from', convert: undefined },
      { key: 'to', convert: undefined },
      { key: 'id', convert: this.toNumber },
      { key: 'value', convert: this.toNumber },
    ]
  }

  toNumber(value: any) {
    return Number(value);
  }

  async handleLogParseSuccess(logDescription: LogDescription, log: Log, transaction: TransactionResponse, block: Block, chainId: number): Promise<boolean> {
    // console.log('handle log parse success of ' + this.chain, logDescription, log, this.logNames);
    if (this.logNames.includes(logDescription.name)) {
      //Save to database
      const data = {} as any;
      for (let index = 0; index < this.mappings.length; index++) {
        const element = this.mappings[index];
        // console.log('convert:', element, !element.convert, logDescription.args[index]);
        data[element.key] = !element.convert ? logDescription.args[index] : element.convert(logDescription.args[index]);
      }
      await this.service.create({
        address: log.address,
        hash: log.transactionHash,
        logIndex: log.logIndex,
        chainId,
        block: BigNumber.from(log.blockNumber).toNumber(),
        timestamp: block?.timestamp ? BigNumber.from(block?.timestamp).toNumber() : 0,
        ...data,
      })
      return true;
    }
    return false;
  }

  async handleLogProcessError(error: any, logDescription: LogDescription, log: Log, transaction: TransactionResponse, block: Block, chainId: number): Promise<boolean> {
    console.log('handleLogProcessError: ', error);
    return false;
  }
}
