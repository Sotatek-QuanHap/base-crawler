import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { RMQBaseHandle } from "src/rabbitmq/RMQBaseHandle";
import { Store } from "src/rabbitmq/store";

@Injectable()
export class ConfigHandle extends RMQBaseHandle {
  constructor(configService: ConfigService) {
    super(configService);
    this.queueName = this.configService.get('CONFIG_UPDATED_QUEUE', 'config-updated');
  }

  async process(message: any): Promise<void> {
    // console.log('message overrride: ', body.content.toString());
    // const message = JSON.parse(body.content.toString());
    console.log('request process at account: ', message);
    switch (message.type) {
      case 'grpcs':
        Store.loadGrpcs(message.chain, true);
        break;
    }
  }
}
