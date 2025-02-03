import { APIMessage, APIUpdate } from '@telegramjs/rest';
import { Client } from './Client.js';
import { Events } from '../util/constants.js';

export class UpdaterClient {
  constructor(private readonly client: Client) {}

  process(update: APIUpdate) {
    this.client.emit(Events.Update, update);

    if ('message' in update) {
      this.processMessage(update.message);
    }
  }

  processMessage(message: APIMessage) {
    this.client.emit(Events.Message, message);
  }
}
