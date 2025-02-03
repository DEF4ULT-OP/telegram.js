import { APIMessage, APIUpdate } from '@telegramjs/rest';
import { Events } from './constants.js';

export interface EventHandlerMap {
  [Events.Debug]: (data: string) => void;
  [Events.Update]: (update: APIUpdate) => void;
  [Events.Message]: (message: APIMessage) => void;
}
