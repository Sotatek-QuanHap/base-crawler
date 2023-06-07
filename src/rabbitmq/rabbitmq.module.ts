import { Module } from "@nestjs/common";
import { Store } from "./store";
import { ConfigService } from '@nestjs/config';
import { ConfigHandle } from "./config.handle";
import { ShareModule } from "src/common/share.module";
import { ThreadHandler } from "./thread.handler";

@Module({
  imports: [
    ShareModule,
  ],
  controllers: [],
  providers: [ConfigService, ConfigHandle, ThreadHandler],
  exports: [ThreadHandler],
})
export class RabbitMQModule {
  constructor(
    private readonly configService: ConfigService,
    private readonly configHandle: ConfigHandle,
    private readonly threadHandler: ThreadHandler,
  ) {
    console.log('rabbit mq module');
    Store.initRabbitMQ(this.configService);
    for (const handle of [this.configHandle]) {
      handle.listen();
    }
    this.threadHandler.run();
  }
}
