import { APIMessage } from '@telegramjs/rest';
import { Base } from './Base.js';
import { Client } from '../client/Client.js';

class BaseMessage extends Base {}

class MessageAPI extends BaseMessage {}
type Constructor<T> = new (...args: any[]) => T;

function mixin<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    methodA() {
      console.log('Method A from Mixin A');
    }
  };
}

export class Message extends mixin() {
  constructor(client: Client, data: APIMessage) {
    super(client);
  }
}
