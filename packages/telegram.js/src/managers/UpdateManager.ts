import { APIUpdate } from '@telegramjs/rest';
import { Events } from '../util/constants';
import { Client } from '../client/Client';

export class UpdateManager {
  constructor(private readonly client: Client) {}

  processUpdate(update: APIUpdate) {
    this.client.emit(Events.Update, update);
  }
}
