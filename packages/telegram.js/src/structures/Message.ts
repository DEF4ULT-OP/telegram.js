import { APIMessage } from '@telegramjs/rest';
import { Base } from './Base.js';
import { Client } from '../client/Client.js';
import { Chat } from './Chat.js';
import { User } from './User.js';
import { TelegramId } from '../util/types.js';

export class Message extends Base<TelegramId, APIMessage> {
  public override id: number;
  public text!: string | null;
  public threadId?: number;
  public from?: User;
  public chat?: Chat;
  public senderChat?: Chat;
  public createdTimestamp: number;

  constructor(client: Client, data: APIMessage) {
    super(client);

    this.id = data.message_id;
    this.createdTimestamp = data.date;

    this._patch(data);
  }

  override _patch(data: APIMessage) {
    this.text = data.text ?? null;

    if ('message_thread_id' in data) {
      this.threadId = data.message_thread_id;
    }
    if ('from' in data) {
      this.from = this.client.users._add(data.from);
    }

    if ('chat' in data) {
      this.chat = this.client.chats._add(data.chat);
    }
    if ('sender_chat' in data) {
      this.senderChat = this.client.chats._add(data.sender_chat);
    }
  }

  get createdAt() {
    return new Date(this.createdTimestamp * 1000);
  }
}
