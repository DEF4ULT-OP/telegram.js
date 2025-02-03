import { APIMessage } from '@telegramjs/rest';
import { Base } from './Base.js';
import { Client } from '../client/Client.js';
import { Chat } from './Chat.js';
import { User } from './User.js';

export class Message extends Base<APIMessage> {
  public id!: number;
  public text!: string | null;
  public threadId?: number;
  public from?: User;
  public chat?: Chat;
  public senderChat?: Chat;
  public createdTimestamp: number;

  constructor(client: Client, data: APIMessage) {
    super(client);

    this.createdTimestamp = data.date;

    this._patch(data);
  }

  override _patch(data: APIMessage) {
    this.id = data.message_id;
    this.text = data.text ?? null;

    if ('message_thread_id' in data) {
      this.threadId = data.message_thread_id;
    }
    if ('from' in data) {
      // this.from = this.client.users.
    }

    if ('chat' in data) {
      this.chat;
    }
    if ('sender_chat' in data) {
      this.senderChat;
    }
  }
}
