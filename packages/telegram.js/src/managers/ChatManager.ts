import { APIChat } from '@telegramjs/rest';
import { Client } from '../client/Client.js';
import { Chat } from '../structures/Chat.js';
import { TelegramId } from '../util/types.js';
import { CachedManager } from './CachedManager.js';

export class ChatManager extends CachedManager<TelegramId, Chat> {
  constructor(client: Client, iterable?: Iterable<APIChat>) {
    super(client, Chat, iterable);
  }

  async fetch(id: TelegramId) {
    const data = await this.client.api.chats.get(id);

    const chat = this._add(data);

    return chat;
  }
}
