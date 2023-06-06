import { ConfigService } from '@nestjs/config';
import { ConsumeMessage } from 'amqplib';
import { BigNumber, ethers, utils } from 'ethers';
// import { ConfigCrawlerService } from "src/common/configCrawlerService/configCrawler.service";
import { RMQBaseHandle } from 'src/rabbitmq/RMQBaseHandle';
import { Store } from 'src/rabbitmq/store';
import { TimeUtils } from 'src/utils/time.utils';
import { BaseHandle } from './base.handle';
import { Block } from '@ethersproject/abstract-provider';
import { InjectModel } from '@nestjs/mongoose';
import {
  CrawlerInfo,
  CrawlerInfoDocument,
} from 'src/common/database/crawler.schema';
import { Model } from 'mongoose';
import { GoogleChatUtils } from 'src/utils/googlechat.utils';
import axios from 'axios';
import { from } from 'rxjs';

export class BaseJob extends RMQBaseHandle {
  protected provider: ethers.providers.JsonRpcProvider;
  protected network: ethers.providers.Network;
  protected grpc: string;
  public chain: string;
  // protected grpcs: Array<string> = [];
  protected grpcIndex: number = 0;
  protected countRetry: number = 0;
  protected lastNumberKey: string;
  protected crawlerInfoModel: Model<CrawlerInfoDocument>;
  // protected configCrawlerService: ConfigCrawlerService;
  protected handles: Array<BaseHandle> = [];
  protected eventNames = {};
  constructor(
    configService: ConfigService,
    @InjectModel(CrawlerInfo.name) crawlerInfoModel: Model<CrawlerInfoDocument>,
  ) {
    super(configService);
    this.crawlerInfoModel = crawlerInfoModel;
    // this.configCrawlerService = configCrawlerService;
  }

  async init() {
    console.log('init at ', this.chain);
    while (true) {
      try {
        await Store.loadGrpcs(this.chain);
        break;
      } catch (error) {
        await TimeUtils.sleepRandom();
      }
    }
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
    this.numberMessageLimit = +this.configService.get(
      `NUMBER_MESSAGE_REQUEST_OF_${this.chain}`.toUpperCase(),
      '0',
    );
    console.log(
      'getNumberMessageLimit of ' + this.chain,
      this.numberMessageLimit,
    );
    return this.numberMessageLimit;
  }

  getQueueName(): string {
    this.queueName = this.configService.get(
      `QUEUE_REQUEST_BLOCK_OF_${this.chain}`.toUpperCase(),
      `request-block-${this.chain}`,
    );
    return this.queueName;
  }

  setQueueName(queueName: string) {
    this.queueName = queueName;
  }

  setHandlers(handlers: BaseHandle[]) {
    this.handles = handlers;
  }

  getHandlers() {
    return this.handles;
  }

  async loadChannel() {
    this.channel = await Store.getChannel(
      this.getQueueName(),
      this.configService,
    );
  }

  async customerListen() {
    console.log('custom listen at ', this.getQueueName())
    await this.channel.prefetch(this.getNumberMessageLimit(), false);
    await this.channel.consume(
      this.getQueueName(),
      (msg) => {
        this.handle(msg, this);
      },
      { noAck: false },
    );
  }

  async process(message: any): Promise<void> {
    console.log('msg: ', message);
    const { type, retry, fromBlock, toBlock, blockNumber, ...other } = message;
    if ((retry || 0) > this.configService.get<number>('NUMBER_RETRY_MAX', 5)) {
      Store.sendToQueue(
        this.configService.get(
          `QUEUE_ERROR_MESSAGE`.toUpperCase(),
          `error-message`,
        ),
        Buffer.from(
          JSON.stringify({
            source: 'retry-max',
            chain: this.chain,
            id: this.getId(),
            message: `number retry is greater than ${this.configService.get<number>('NUMBER_RETRY_MAX', 5)}`,
            data: message,
          }),
        ),
        this.configService,
      );
      return;
    }
    switch (message.type) {
      case 'range':
        await this.loadByRange(this, { fromBlock: BigNumber.from(fromBlock).toHexString(), toBlock: BigNumber.from(toBlock).toHexString(), other }, retry);
        break;
      default:
        await this.run(this, blockNumber, retry);
    }
  }

  async loadProvider(): Promise<void> {
    while (true) {
      const grpcs = Store.grpcs[this.chain] || [];
      this.grpcIndex++;
      if (this.grpcIndex >= grpcs.length) {
        this.countRetry++;
        this.grpcIndex = 0;
      }

      if (this.grpcIndex >= grpcs.length || this.countRetry > 10) {
        console.log('grps: ', grpcs, this.grpcIndex, this.countRetry);
        Store.sendToQueue(
          this.configService.get(
            `QUEUE_ERROR_MESSAGE`.toUpperCase(),
            `error-message`,
          ),
          Buffer.from(
            JSON.stringify({
              source: 'load-grpc',
              chain: this.chain,
              id: this.getId(),
              message: 'grpcs is empty',
            }),
          ),
          this.configService,
        );
        await Store.loadGrpcs(this.chain);
        this.countRetry = 0;
        // try {
        //   console.log('this.channel ', (this.channel != null))
        //   await this.channel.close();

        // } catch (error) {
        //   console.log('error: ', error);
        //   await TimeUtils.sleepRandom();

        // }
        // throw { message: 'Cannot load provider' };
      }
      console.log(`load grpc of ${this.chain}`, grpcs, grpcs[this.grpcIndex]);

      try {
        if (this.network)
          this.provider = new ethers.providers.JsonRpcProvider(
            grpcs[this.grpcIndex],
            this.network,
          );
        else {
          this.provider = new ethers.providers.JsonRpcProvider(
            grpcs[this.grpcIndex],
          );
          this.network = await this.provider.getNetwork();
        }
        this.grpc = grpcs[this.grpcIndex];
      } catch (error) {
        GoogleChatUtils.sendNormalText(`error load provider: ${error}`);
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
        GoogleChatUtils.sendNormalText(
          `error at request blockchain:${name} ${JSON.stringify(data)} ${error}`,
        );
        console.log('error at request blockchain', name, data, error);
        await TimeUtils.sleep(Math.round(Math.random() * 3000 + 1000));
        await this.loadProvider();
      }
    }
  }

  async requestBlockChainByAxios(data: any): Promise<any> {
    while (true) {
      try {
        const res = await axios({
          method: 'post',
          url: this.grpc,
          headers: {
            'Content-Type': 'application/json'
          },
          data,
        })
        return res.data?.result;
      } catch (error) {
        GoogleChatUtils.sendNormalText(
          `error at request blockchain by axios using ${this.grpc}: ${JSON.stringify(data)} ${error.toString()}`,
        );
        console.log('error at request blockchain', data, error.toString());
        await TimeUtils.sleep(Math.round(Math.random() * 3000 + 1000));
        await this.loadProvider();
      }
    }
  }

  async getLogs(data: any, retry: number = 0): Promise<Array<ethers.providers.Log>> {

    const topicRequest = [];
    if (retry && retry > this.configService.get<number>('RETRY_LEVEL_I', 3)) {
      const topics = {};
      for (const handler of this.getHandlers()) {
        for (const e of handler.toTopics()) {
          topics[e.name] = e.topic;
        }
      }
      if (Object.values(topics).length)
        topicRequest.push(Object.values(topics));
    }
    //   return await this.requestBlockChain<Array<ethers.providers.Log>>(
    //     'getLogs',
    //     data,
    //   );


    // if (this.configService.get<number>('RETRY_LEVEL_I', 3) < retry && retry < this.configService.get<number>('RETRY_LEVEL_I', 5))
    //   return await this.requestBlockChain<Array<ethers.providers.Log>>(
    //     'getLogs',
    //     { ...data, topics: [Object.values(topics)] },
    //   );

    const raw = JSON.stringify({
      "method": "eth_getLogs",
      "params": [
        {
          ...data,
          "topics": topicRequest,
        }
      ],
      "id": Math.round(Math.random() * 50) + Math.round(Math.random() * 50),
      "jsonrpc": "2.0"
    });

    console.log('raw: ', raw);
    return await this.requestBlockChainByAxios(raw);
  }

  exportLogs(transaction: ethers.providers.TransactionResponse) {
    return new Promise(async (resolve, reject) => {
      try {
        const receipt = await transaction.wait();
        resolve({ transaction, logs: receipt.logs });
      } catch (error) {
        resolve({ transaction, logs: [] });
      }
    });
  }

  async loadByRange(self: BaseJob, data: any, retry?: number): Promise<void> {
    if (!self.provider) {
      await self.loadProvider();
    }

    const logs = await self.getLogs(data, retry);
    for (const log of logs) {
      // console.log(log);
      for (const handle of self.handles) {
        const isBreak = await handle.processLog(
          log,
          undefined,
          undefined,
          undefined,
          this.network?.chainId,
        );
        if (isBreak) {
          break;
        }
      }
    }
  }

  async run(self: BaseJob, numberBlock: number, retry?: number): Promise<void> {
    if (!self.provider) {
      await self.loadProvider();
    }
    console.log('number block: ', numberBlock);
    if (!numberBlock) return;
    // this.provider.getBlock(numberBlock);
    const block = await this.requestBlockChain<Block>('getBlock', numberBlock);

    if (block == null) {
      console.log('block is null');
      return;
    }
    // for (const transaction of block.transactions) {
    //   for (const handle of self.handles) {
    //     const isBreak = await handle.processTransaction(transaction, block);
    //     if (isBreak) {
    //       break;
    //     }
    //   }
    // }
    const start = Date.now();

    const logs = await self.getLogs({ blockHash: block.hash }, retry);
    console.log(`Load logs: `, Date.now() - start);
    const sumary = {} as any;
    for (const log of logs) {
      for (const handle of self.handles) {
        const isBreak = await handle.processLog(
          log,
          undefined,
          block,
          sumary,
          this.network?.chainId,
        );
        if (isBreak) {
          break;
        }
      }
    }

    //save blockchain
    try {
      console.log('sumary: ', sumary);
      await this.crawlerInfoModel.findOneAndUpdate(
        { chainId: this.provider.network.chainId, block: numberBlock },
        {
          chainId: this.provider.network.chainId,
          block: numberBlock,
          chain: this.chain,
          timestamp: Date.now(),
          total: logs.length,
          sumaries: sumary,
        },
        { upsert: true },
      );
    } catch (error) {
      console.log('error when save block', error);
    }

    // setTimeout(self.run, 3000, self);
  }

  async handleSuccess(
    message: ConsumeMessage,
    messageParse: any,
    sefl: RMQBaseHandle,
  ) {
    console.log('handle success of base job: ', sefl.getQueueName());
    try {
      sefl.channel.ack(message);
    } catch (error) {
      console.log('error at handle success', error, !sefl.channel);
    }
  }
}


//0x85b26c
//0x85b26c
//