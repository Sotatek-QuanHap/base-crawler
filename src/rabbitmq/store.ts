import { ConfigService } from '@nestjs/config';
import * as client from 'amqplib';
import { Channel, Connection } from 'amqplib';
import axios from 'axios';
import { TimeUtils } from 'src/utils/time.utils';

export class Store {
  public static connection: Connection;
  private static config: ConfigService;
  private static uri: string;
  private static channels = new Map<string, Channel>();
  private static exchanges = new Map<string, Channel>();
  public static grpcs = new Map<string, Array<string>>();
  public static apiEtherScans = new Map<string, Array<string>>();
  public static coinMaps = new Map<string, Map<string, any>>();
  private static isRequestConnected = false;
  public static instanceId = `crawler-instance-${Math.round(
    Math.random() * Date.now(),
  )}`;

  static async initRabbitMQ(config: ConfigService): Promise<void> {
    this.config = config;
    const rabbitmq_uri = this.config.get<string>(
      'RABBITMQ_URI',
      'amqp://admin:admin@localhost:5672',
    );
    this.uri = rabbitmq_uri;
    await this.connect();
  }

  static async pingAPIEtherScans(chain: string): Promise<void> {
    const grpcUrl = this.config.get(
      `CONFIG_API_PING_ETHER_SCAN_URL_${chain}`.toUpperCase(),
      `${this.config.get(
        'BASE_URL',
        'http://localhost:4156',
      )}/api/v1/configs/ping/api_ether_scan_of_${chain}/${this.instanceId}`,
    );
    console.log('ping grpcUrl: ', grpcUrl);
    if (!grpcUrl) return;
    await axios({
      method: 'get',
      url: grpcUrl,
      headers: {
        'x-tream': '',
        instance: this.instanceId,
        isPing: true,
      },
    });
  }

  static async loadAPIEtherScans(
    chain: string,
    isReplace = false,
  ): Promise<void> {
    if (!isReplace && this.grpcs[chain]) return;
    const grpcUrl = this.config.get(
      `CONFIG_API_ETHER_SCAN_URL_${chain}`.toUpperCase(),
      `${this.config.get(
        'BASE_URL',
        'http://localhost:4156',
      )}/api/v1/configs/api_ether_scan_of_${chain}`,
    );
    console.log('api ether scan Url: ', grpcUrl);
    if (!grpcUrl) return;
    const res = await axios({
      method: 'get',
      url: grpcUrl,
      headers: {
        'x-tream': '',
        instance: this.instanceId,
      },
    });
    console.log('res.data: ', res.data);

    this.apiEtherScans[chain] = (res.data?.data?.stringValue || '')
      .split(',')
      .map((s: string) => s.trim());
  }

  static async loadGrpcs(chain: string, isReplace = false): Promise<void> {
    if (!isReplace && this.grpcs[chain]) return;
    const grpcUrl = this.config.get(
      `CONFIG_GRPC_URL_${chain}`.toUpperCase(),
      `${this.config.get(
        'BASE_URL',
        'http://localhost:4156',
      )}/api/v1/configs/grpc_of_${chain}`,
    );
    console.log('grpcUrl: ', grpcUrl);
    if (!grpcUrl) return;
    const res = await axios({
      method: 'get',
      url: grpcUrl,
      headers: {
        'x-tream': '',
        instance: this.instanceId,
      },
    });
    console.log('res.data: ', res.data);
    if (!res.data?.stringValue) {
      console.log('res.data?.stringValue: ', res.data);
      throw new Error('No data existed');
    }

    this.grpcs[chain] = (res.data?.stringValue || '')
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length);
    console.log('grpcs: ', chain, this.grpcs);
  }

  static async loadCoinMaps(chain: string, isReplace = false): Promise<void> {
    if (!isReplace && this.coinMaps[chain]) {
      return;
    }
    const url = this.config.get(
      `CONFIG_ADDRESS_LISTEN_URL_OF_${chain}`.toUpperCase(),
      `${this.config.get(
        'BASE_URL',
        'http://localhost:4156',
      )}/api/v1/configs/address_listen_of_${chain}`,
    );
    console.log('load config:', url);
    if (!url) return;
    const res = await axios({
      method: 'get',
      url,
      headers: {
        'x-tream': '',
        instance: this.instanceId,
      },
    });
    console.log(`CONFIG_ADDRESS_LISTEN_URL_OF_${chain}:`, res.data);

    const data = res.data?.data?.stringValue || '';
    const maps = new Map<string, string>();
    console.log('data: ', data);
    for (const element of data.split(';')) {
      const parts = element.split(':');

      maps[parts[0].toLowerCase()] = parts[1];
      console.log('parts: ', parts, Object.keys(maps));
    }
    if (Object.keys(maps).length > 0) {
      this.coinMaps[chain] = maps;
      console.log('update coin map', this.coinMaps[chain]);
    }
  }

  static async connect(): Promise<void> {
    if (this.isRequestConnected) {
      console.log('is requested');
      return;
    }
    if (!this.connection) {
      this.isRequestConnected = true;
      console.log('this.uri: ', this.uri);
      try {
        this.connection = await client.connect(this.uri);
      } catch (error) {
        this.isRequestConnected = false;
        this.connection = undefined;
        console.log('connect has erro, need reconnect');
        await TimeUtils.sleep(Math.round(Math.random() * 3000 + 3000));
        await Store.connect();
        return;
      }
    }
    this.connection.on('error', () => {
      console.log('Connection error');
    });
    this.connection.on('close', async () => {
      console.log('Connection close');
      this.connection = undefined;
      this.channels = new Map<string, Channel>();
      this.exchanges = new Map<string, Channel>();
      this.isRequestConnected = false;
    });
  }

  static async sendToQueue(
    queue: string,
    message: Buffer,
    config: ConfigService,
    priority = 0,
  ) {
    console.log('sendToQueue: ', queue);
    const channelTransactionUpdated = await this.getChannel(queue, config);
    channelTransactionUpdated.sendToQueue(queue, message, { priority });
  }

  static async publishToQueue(
    queue: string,
    message: Buffer,
    config: ConfigService,
  ) {
    const channelTransactionUpdated = await this.getExchange(queue, config);
    channelTransactionUpdated.publish(queue, '', message);
  }

  static async getChannel(
    queueName: string,
    configService: ConfigService,
  ): Promise<Channel> {
    console.log('request queue name: ', queueName, !!this.channels[queueName]);
    if (!this.connection) {
      await this.initRabbitMQ(configService);
    }
    while (!this.channels[queueName]) {
      while (!this.connection) {
        await TimeUtils.sleep(3000);
      }
      try {
        const channel = await this.connection.createChannel();
        await channel.assertQueue(queueName, {
          durable: true,
          maxPriority: 10,
        });
        this.channels[queueName] = channel;
        break;
      } catch (error) {
        await TimeUtils.sleep(3000);
      }
    }
    return this.channels[queueName];
  }

  static async getExchange(
    queueName: string,
    configService: ConfigService,
  ): Promise<Channel> {
    if (!this.connection) {
      await this.initRabbitMQ(configService);
    }
    while (!this.exchanges[queueName]) {
      while (!this.connection) {
        await TimeUtils.sleep(3000);
      }
      try {
        const channel = await this.connection.createChannel();
        await channel.assertExchange(queueName, 'fanout', {
          durable: false,
        });
        this.exchanges[queueName] = channel;
        break;
      } catch (error) {
        await TimeUtils.sleep(3000);
      }
    }
    return this.exchanges[queueName];
  }

  static removeQueue(queueName: string) {
    delete this.exchanges[queueName];
    delete this.channels[queueName];
    console.log(
      'removeQueue',
      queueName,
      !!this.exchanges[queueName],
      !!this.channels[queueName],
    );
  }

  static hasChannelQueue(queueName: string) {
    return !!this.channels[queueName];
  }

  static hasExchangeQueue(queueName: string) {
    return !!this.exchanges[queueName];
  }
}
