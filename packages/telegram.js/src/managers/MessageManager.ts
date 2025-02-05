import { APIMessage } from '@telegramjs/rest';
import { Chat } from '../structures/Chat.js';
import { Message } from '../structures/Message.js';
import { TelegramId } from '../util/types.js';
import { CachedManager } from './CachedManager.js';

export class MessageManager extends CachedManager<
  TelegramId,
  Message,
  APIMessage,
  TelegramId | Message
> {
  constructor(
    public readonly chat: Chat,
    iterable?: Iterable<APIMessage>
  ) {
    super(chat.client, Message, iterable);
  }
}
