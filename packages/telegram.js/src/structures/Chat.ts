import { APIChat, APIChatType } from '@telegramjs/rest';
import { Client } from '../client/Client';
import { Base } from './Base';

export enum ChatType {
  Private = 'private',
  Group = 'group',
  Supergroup = 'supergroup',
  Channel = 'channel',
}

export class Chat extends Base<APIChatType> {
  id: number;
  type: ChatType;
  title?: string;
  username?: string;
  firstName?: string;
  lastName?: string;

  constructor(client: Client, data: APIChat) {
    super(client);
    this.id = data.id;
    this.type = data.type as unknown as ChatType;

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
}
