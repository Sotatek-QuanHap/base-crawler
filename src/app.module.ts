import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShareModule } from './common/share.module';
import { DefiModule } from './modules/defi/defi.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ShareModule,
    RabbitMQModule,
    DefiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
}
