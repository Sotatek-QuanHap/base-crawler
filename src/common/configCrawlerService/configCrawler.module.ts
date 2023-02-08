import { Module } from "@nestjs/common";
import { ShareModule } from "../share.module";
import { ConfigCrawlerService } from "./configCrawler.service";

@Module({
  imports: [
    ShareModule,
  ],
  controllers: [],
  providers: [ConfigCrawlerService],
  exports: [ConfigCrawlerService],
})
export class ConfigCrawlerModule { }
