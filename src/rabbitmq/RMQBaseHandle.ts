import { Channel, ConsumeMessage } from "amqplib";
import { ConfigService } from '@nestjs/config';
import { Store } from "./store";
import { TimeUtils } from "src/utils/time.utils";

export class RMQBaseHandle {
  public channel: Channel;
  public startAt: string;
  public queueName: string;
  public configService: ConfigService;
  protected numberMessageLimit: number = 0;
  constructor(configService: ConfigService) {
    this.configService = configService;
    this.startAt = `${Date.now()}`;
  }

  getNumberMessageLimit(): number {
    return this.numberMessageLimit;
  }

  getQueueName() {
    return this.queueName;
  }

  getId(): string {
    return `${Store.instanceId}-${this.getQueueName()}-${this.startAt}`;
  }

  async loadChannel() {
    this.channel = await Store.getExchange(this.getQueueName(), this.configService);
  }

  async customerListen() {
    const rs = await this.channel.assertQueue('', { exclusive: false });
    console.log('rs: ', rs);
    this.channel.bindQueue(rs.queue, this.getQueueName(), '');

    this.channel.consume(rs.queue, (msg) => {
      this.handle(msg, this);
    }, { noAck: true });
  }

  async listen(): Promise<void> {
    await this.loadChannel();
    this.channel.on('error', () => {
      Store.removeQueue(this.getQueueName());
      console.log('Channel error');
      try {
        this.channel.close();
      } catch (error) {

      }
    });
    this.channel.on('close', async () => {
      Store.removeQueue(this.getQueueName());
      console.log('Channel close');
      await TimeUtils.sleep(Math.round(Math.random() * 3000 + 3000));
      try {
        this.listen();
      } catch (error) {

      }
    });
    try {
      await this.customerListen();
    } catch (error) {
      console.log('assert queue at exchange', error);
    }
  }

  async handle(body: ConsumeMessage, sefl: RMQBaseHandle): Promise<void> {
    console.log('handle at ' + this.getQueueName(), sefl.getQueueName());
    let message;
    try {
      message = await sefl.parseObject(body);
    } catch (error) {
      return sefl.handleParseError(body, sefl, error);
    }
    try {
      await sefl.process(message);
      console.log('self: ', sefl.getQueueName());
      sefl.handleSuccess(body, message, sefl);
    } catch (error) {
      sefl.handleError(body, sefl, error);
    }
  }

  async parseObject(body: ConsumeMessage) {
    return JSON.parse(body.content.toString());
  }

  async handleParseError(message: ConsumeMessage, sefl: RMQBaseHandle, error: any) {
    console.log('parse error, ', error);
  }

  async process(message: any): Promise<void> {
    console.log('message: ', JSON.stringify(message));
  }

  async handleError(message: ConsumeMessage, sefl: RMQBaseHandle, error: any) {
    console.log('has error, ', error);
  }

  async handleSuccess(message: ConsumeMessage, messageParse: any, sefl: RMQBaseHandle) {
    console.log('handle success: ', sefl.getQueueName());
  }
}
