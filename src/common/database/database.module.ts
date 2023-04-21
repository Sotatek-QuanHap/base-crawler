import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const username = configService.get('DB_USER');
        const password = configService.get('DB_PASS');
        const database = configService.get('DB_NAME');
        const host = configService.get('DB_HOST');
        const port = configService.get('DB_PORT');

        console.log('database: ', {
          username, password, database, host, port
        })
        if (!username) {
          return {
            uri: `mongodb://${host}:${port}/${database}?directConnection=true`,
            dbName: database,

          }
        }
        return {
          uri: `mongodb://${username}:${password}@${host}:${port}/${database}?directConnection=true&authSource=admin&retryWrites=false&w=majority`,
          dbName: database,

        }
      },
      inject: [ConfigService]
    }),
  ],
})
export class DatabaseModule { }
