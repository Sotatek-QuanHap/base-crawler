import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

export class GoogleChatUtils {
  private static webhookURL: string = process.env.WEBHOOK_URL;

  static async sendNormalText(
    _message: string,
    _url: any = this.webhookURL,
  ): Promise<any> {
    await axios
      .post(_url || this.webhookURL, {
        text: _message,
      })
      .then((rs) => {
        console.log('success sent gooogle chat', rs.data);
      })
      .catch((err) => {
        console.log('error at send gooogle chat', err);
      });
  }
}
