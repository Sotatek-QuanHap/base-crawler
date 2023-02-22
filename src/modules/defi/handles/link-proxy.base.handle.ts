import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseHandle } from "src/rabbitmq/base.handle";
import { Log, TransactionResponse, Block } from "@ethersproject/abstract-provider";
import { LogDescription } from "ethers/lib/utils";
import { LinkProxyService } from "../gateway/proxy/link-proxy.service";
import { BaseService } from "src/rabbitmq/base.service";

@Injectable()
export class LinkProxyBaseHandle extends BaseHandle {
  protected logNames: string[];
  protected service: BaseService<any>;
  protected mappings = [
    { key: 'borrower', convert: undefined },
    { key: 'owner', convert: undefined },
  ];
  constructor(name: string, configService: ConfigService, service: LinkProxyService) {
    super(name, configService);
    this.service = service;
    this.logNames = ['BorrowerCreated'];
  }

  async handleLogParseSuccess(logDescription: LogDescription, log: Log, transaction: TransactionResponse, block: Block, chainId: number): Promise<boolean> {
    console.log('Link proxy ' + this.chain, logDescription, log);
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
        block: block.number,
        timestamp: block.timestamp,
        ...data,
      })
    }
    return false;
  }

  async handleLogProcessError(error: any, logDescription: LogDescription, log: Log, transaction: TransactionResponse, block: Block, chainId: number): Promise<boolean> {
    console.log('handleLogProcessError: ', error);
    return false;
  }
}
