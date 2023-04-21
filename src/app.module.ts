import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
  constructor(private configService: ConfigService) {
    console.log('ENV: ', process.env);
    for (const key of ['DB_HOST', 'RABBITMQ_URI', 'BASE_URL', 'NUMBER_MESSAGE_REQUEST_OF_ETHEREUM']) {
      console.log(`ENV of ${key}: `, this.configService.get(key));
    }
  }
}
