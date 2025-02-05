import { APIChat } from '@telegramjs/rest';
import { Client } from '../client/Client.js';
import { Base } from './Base.js';
import { MessageManager } from '../managers/MessageManager.js';

export enum ChatType {
  Private = 'private',
  Group = 'group',
  Supergroup = 'supergroup',
  Channel = 'channel',
}

export class Chat extends Base<APIChat> {
  override id: number;
  public type: ChatType;
  public title?: string;
  public username?: string;
  public firstName?: string;
  public lastName?: string;

  public readonly messages: MessageManager;

  constructor(client: Client, data: APIChat) {
    super(client);
    this.id = data.id;
    this.type = data.type as unknown as ChatType;

    this.messages = new MessageManager(this);

    this._patch(data);
  }

  override _patch(data: APIChat) {
    if ('title' in data) {
      this.title = data.title;
    }

    if ('username' in data) {
      this.username = data.username;
    }

    if ('first_name' in data) {
      this.firstName = data.first_name;
    }

    if ('last_name' in data) {
      this.lastName = data.last_name;
    }
  }

  async send(text: string, options: any) {
    const data = await this.client.api.chats.sendMessage(
      this.id,
      text,
      options
    );

    const message = this.messages._add(data, false);

    return message;
  }
}
