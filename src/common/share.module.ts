import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CrawlerInfo, CrawlerInfoSchema } from './database/crawler.schema';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: CrawlerInfo.name, schema: CrawlerInfoSchema },
    ]),
  ],
  exports: [DatabaseModule, MongooseModule],
})
export class ShareModule {}
