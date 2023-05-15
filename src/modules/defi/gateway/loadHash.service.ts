import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { Store } from 'src/rabbitmq/store';
import { TimeUtils } from 'src/utils/time.utils';

@Injectable()
export class loadHash {
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

  async getTransaction(hash: string): Promise<any> {
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
