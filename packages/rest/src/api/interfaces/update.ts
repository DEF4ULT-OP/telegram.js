import { APIMessage } from './message.js';

export interface APIUpdateOptions {
  offset?: number;
  limit?: number;
  timeout?: number;
  allowed_updates?: string[];
}

export interface APIUpdate {
  update_id: number;
  message?: APIMessage;
  channel_post?: APIMessage;
}
