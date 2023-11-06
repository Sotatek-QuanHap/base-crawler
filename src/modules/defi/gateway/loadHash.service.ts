import { TransactionResponse } from '@ethersproject/abstract-provider';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { Store } from 'src/rabbitmq/store';
import { TimeUtils } from 'src/utils/time.utils';

@Injectable()
export class LoadHash {
  private provider: ethers.providers.JsonRpcProvider;
  private network: ethers.providers.Network;
  private chain = 'ethereum';
  private grpcIndex: number = 0;
  private countRetry: number = 0;
  private queueName: string;
  private startAt: string;
  constructor(private configService: ConfigService) {
    this.loadProvider();
  }

  async getTransaction(hash: string): Promise<TransactionResponse> {
    while (true) {
      try {
        return await this.provider.getTransaction(hash);
      } catch (error) {
        console.log('error at get transaction', hash, error);
        await TimeUtils.sleep(Math.round(Math.random() * 3000 + 1000));
        await this.loadProvider();
      }
    }
  }

  async getTransactionReceipt(
    hash: string,
  ): Promise<ethers.providers.TransactionReceipt> {
    while (true) {
      try {
        return await this.provider.getTransactionReceipt(hash);
      } catch (error) {
        console.log('error at get transaction receipt', hash, error);
        await TimeUtils.sleep(Math.round(Math.random() * 3000 + 1000));
        await this.loadProvider();
      }
    }
  }

  async getTimestampBlockNumber(block: number): Promise<number> {
    while (true) {
      try {
        return (await this.provider.getBlock(block)).timestamp;
      } catch (error) {
        console.log('error at get timestamp for block number', block, error);
        await TimeUtils.sleep(Math.round(Math.random() * 3000 + 1000));
        await this.loadProvider();
      }
    }
  }

  async parseLogs(logs: any, abi: any): Promise<any> {
    const logInterface: ethers.utils.Interface = new ethers.utils.Interface(
      abi,
    );
    for (const log of logs) {
      try {
        const rs = logInterface.parseLog(log);
        return { ...rs, logIndex: log.logIndex };
      } catch (error) {
        console.log('error at parseLog', error);
      }
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
      } catch (error) {
        this.network = undefined;
        await TimeUtils.sleep(Math.round(Math.random() * 3000 + 1000));
        continue;
      }
      break;
    }
  }
  getId(): string {
    return `${Store.instanceId}-${this.getQueueName()}-${this.startAt}`;
  }
  getQueueName() {
    return this.queueName;
  }
}
