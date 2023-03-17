import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseService } from "src/rabbitmq/base.service";
import { RMQBaseHandle } from "src/rabbitmq/RMQBaseHandle";
import { Store } from "src/rabbitmq/store";

@Injectable()
export class BaseListener<T> extends RMQBaseHandle {
  protected service: BaseService<T>;
  constructor(
    configService: ConfigService,
    service: BaseService<T>,
    queueName: string
  ) {
    super(configService);
    this.service = service;
    this.queueName = queueName;
    this.listen();
  }

  async loadChannel() {
    this.channel = await Store.getChannel(this.getQueueName(), this.configService);
  }

  async customerListen() {
    console.log('custom listern at ', this.queueName, this.getNumberMessageLimit());
    if (this.getNumberMessageLimit() < 1)
      return;
    this.channel.prefetch(this.getNumberMessageLimit(), false);
    this.channel.consume(this.getQueueName(), (msg) => {
      this.handle(msg, this);
    }, { noAck: false });
  }

  async process(message: any): Promise<void> {
    await this.service.update(message);

  }

}
