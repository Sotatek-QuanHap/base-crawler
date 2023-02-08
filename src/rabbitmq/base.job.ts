import { ConfigService } from "@nestjs/config";
import { ConsumeMessage } from "amqplib";
import { ethers } from "ethers";
import { ConfigCrawlerService } from "src/common/configCrawlerService/configCrawler.service";
import { RMQBaseHandle } from "src/rabbitmq/RMQBaseHandle";
import { Store } from "src/rabbitmq/store";
import { TimeUtils } from "src/utils/time.utils";
import { BaseHandle } from "./base.handle";
import { BlockWithTransactions } from '@ethersproject/abstract-provider';

export class BaseJob extends RMQBaseHandle {
  protected provider: ethers.providers.JsonRpcProvider;
  protected network: ethers.providers.Network;
  public chain: string;
  // protected grpcs: Array<string> = [];
  protected grpcIndex: number = 0;
  protected countRetry: number = 0;
  protected lastNumberKey: string;
  protected configCrawlerService: ConfigCrawlerService;
  protected handles: Array<BaseHandle> = [];
  constructor(configCrawlerService: ConfigCrawlerService, configService: ConfigService) {
    super(configService);
    this.configCrawlerService = configCrawlerService;
  };

  async init() {
    console.log('init at ', this.chain);
    await Store.loadGrpcs(this.chain);
    await Store.loadCoinMaps(this.chain);
    await this.loadProvider();
    for (const handle of this.handles) {
      handle.chain = this.chain;
      await handle.initHandle();
    }
  }

  async listen(): Promise<void> {
    await this.init();
    await super.listen();
  }

  getNumberMessageLimit(): number {
    this.numberMessageLimit = +this.configService.get(`NUMBER_MESSAGE_REQUEST_OF_${this.chain}`.toUpperCase(), '0');
    return this.numberMessageLimit;
  }

  getQueueName(): string {
    this.queueName = this.configService.get(`QUEUE_REQUEST_BLOCK_OF_${this.chain}`.toUpperCase(), `request-block-${this.chain}`);
    return this.queueName;
  }

  async loadChannel() {
    this.channel = await Store.getChannel(this.getQueueName(), this.configService);
  }

  async customerListen() {
    this.channel.prefetch(this.getNumberMessageLimit(), false);
    this.channel.consume(this.getQueueName(), (msg) => {
      this.handle(msg, this);
    }, { noAck: false });
  }

  async process(message: any): Promise<void> {
    console.log('msg: ', message);
    await this.run(this, message.blockNumber);
  }

  async loadProvider(): Promise<void> {
    while (true) {
      const grpcs = Store.grpcs[this.chain] || [];
      this.grpcIndex++;
      if (this.grpcIndex >= grpcs.length) {
        this.countRetry++;
        this.grpcIndex = 0;
      }

      if (this.grpcIndex >= grpcs.length) {
        Store.sendToQueue(this.configService.get(`QUEUE_ERROR_MESSAGE`.toUpperCase(), `error-message`),
          Buffer.from(JSON.stringify({
            source: 'load-grpc',
            chain: this.chain,
            id: this.getId(),
            message: 'grpcs is empty',
          })),
          this.configService);
        try {
          this.channel.close();
          return;
        } catch (error) {
          console.log('error: ', error);
          await TimeUtils.sleepRandom();
          continue;
        }

      }
      console.log(`load grpc of ${this.chain}`, grpcs, grpcs[this.grpcIndex])

      try {
        if (this.network)
          this.provider = new ethers.providers.JsonRpcProvider(grpcs[this.grpcIndex], this.network);
        else {
          this.provider = new ethers.providers.JsonRpcProvider(grpcs[this.grpcIndex]);
          this.network = await this.provider.getNetwork();
        }
      } catch (error) {
        this.network = undefined;
        await TimeUtils.sleep(Math.round(Math.random() * 3000 + 1000));
        continue;
      }
      break;
    }
  }

  async requestBlockChain<T>(name: string, data: any): Promise<T> {
    while (true) {
      try {
        return await this.provider[name](data);
      } catch (error) {
        console.log('error at request blockchain', name, data, error);
        await TimeUtils.sleep(Math.round(Math.random() * 3000 + 1000));
        await this.loadProvider();
      }
    }
  }

  async getLogs(blockHash: string): Promise<Array<ethers.providers.Log>> {
    return await this.requestBlockChain<Array<ethers.providers.Log>>('getLogs', { blockHash });
  }

  exportLogs(transaction: ethers.providers.TransactionResponse) {
    return new Promise(async (resolve, reject) => {
      try {
        const receipt = await transaction.wait();
        resolve({ transaction, logs: receipt.logs });
      } catch (error) {
        resolve({ transaction, logs: [] });
      }
    })
  }



  async run(self: BaseJob, numberBlock: number): Promise<void> {
    if (!self.provider) {
      await self.loadProvider();
    }
    console.log('number block: ', numberBlock)
    if (!numberBlock)
      return;
    const block = await this.requestBlockChain<BlockWithTransactions>('getBlockWithTransactions', numberBlock);
    if (block == null) {
      console.log('block is null')
      return;
    }
    for (const transaction of block.transactions) {
      for (const handle of self.handles) {
        const isBreak = await handle.processTransaction(transaction, block);
        if (isBreak) {
          break;
        }
      }
    }
    const start = Date.now();
    const logs = await this.getLogs(block.hash);
    console.log(`Load logs: `, (Date.now() - start));
    for (const log of logs) {
      for (const handle of self.handles) {
        const isBreak = await handle.processLog(log, undefined, block);
        if (isBreak) {
          break;
        }
      }
    }
    // setTimeout(self.run, 3000, self);
  }
  async handleError(message: ConsumeMessage, sefl: RMQBaseHandle, error: any) {
    // console.log('has error, ', error);
    try {
      // sefl.channel.sendToQueue(sefl.queueName, Buffer.from(message.content));
      sefl.channel.ack(message);
    } catch (error) {

    }
  }

  async handleSuccess(message: ConsumeMessage, messageParse: any, sefl: RMQBaseHandle) {
    console.log('handle success of base job: ', sefl.getQueueName());
    try {
      sefl.channel.ack(message);
    } catch (error) {
      console.log('error at handle success', error, !sefl.channel);
    }
  }

}
