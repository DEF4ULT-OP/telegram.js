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

  processMessage(data: APIMessage) {
    const chat = this.client.chats._add(data.chat);
    const existing = chat.messages.cache.get(data.message_id);
    const message = existing ?? chat.messages._add(data);

    this.client.emit(Events.Message, message);
  }
}
