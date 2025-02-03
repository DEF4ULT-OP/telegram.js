import { APIMessage } from './message.js';

export interface APIUpdateOptions {
  offset?: number;
  limit?: number;
  timeout?: number;
  allowedUpdates?: string[];
}

export class APIUpdate {
  public readonly id: number;
  public readonly rawData: any;
  public readonly message?: APIMessage;
  public readonly editedMessage?: APIMessage;
  public readonly channelPost?: APIMessage;
  public readonly editedChannelPost?: APIMessage;

  constructor(data: any) {
    this.id = data.update_id;
    this.rawData = data;

    if ('message' in data) {
      this.message = new APIMessage(data.message);
    }

    if ('edited_message' in data) {
      this.editedMessage = new APIMessage(data.edited_message);
    }

    if ('channel_post' in data) {
      this.channelPost = new APIMessage(data.channel_post);
    }

    if ('edited_channel_post' in data) {
      this.editedChannelPost = new APIMessage(data.edited_channel_post);
    }
  }
}
