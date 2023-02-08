import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Store } from 'src/rabbitmq/store';
import { ConfigCrawlerService } from '../configCrawlerService/configCrawler.service';

export class AccountStore {
  private static accounts: Map<string, any> = new Map<string, any>();
  private static hotWallets: Map<string, any> = new Map<string, any>();
  private static configService: ConfigService;
  public static setConfigService(configService: ConfigService) {
    this.configService = configService;
  }
  public static getAccount(acc: string) {
    if (!acc)
      return null;
    // console.log('account not found: ', acc.toLowerCase().trim(), this.accounts);
    return this.accounts[acc.toLowerCase().trim()];
  }

  public static getHotWallet(acc: string) {
    if (!acc)
      return null;
    return this.hotWallets[acc.toLowerCase().trim()];
  }

  public static async loadAccounts() {
    const accountUrl = await this.configService.get('ACCOUNT_URL', `${this.configService.get('BASE_URL', 'http://localhost:4156')}/api/v1/wallets`);
    if (!accountUrl)
      return;
    const res = await axios({
      method: 'get',
      url: accountUrl,
      headers: {
        'x-tream': '',
        'instance': Store.instanceId,
      }
    });

    for (const acc of (res.data?.data || [])) {
      if (!acc.address?.trim()) {
        continue;
      }
      this.accounts[acc.address.toLowerCase().trim()] = true;
    }
    console.log('request account complete: ', this.accounts);
  }

  public static async appendAccount(acc: string) {
    this.accounts[acc.toLowerCase().trim()] = true;
  }
}
