import { APIUpdate } from '@telegramjs/rest';
import { Events } from './constants.js';
import { UserManager } from '../managers/UserManager.js';
import { User } from '../structures/User.js';
import { DataManager } from '../managers/DataManager.js';
import { Collection } from '@telegramjs/collection';
import { LimitedCollectionOptions } from './limitedCollection.js';
import { Message } from '../structures/Message.js';

export type TelegramId = number;

export type Constructable<Entity> = abstract new (...args: any[]) => Entity;

export interface EventHandlerMap {
  [Events.Ready]: () => void;
  [Events.Debug]: (data: string) => void;
  [Events.Update]: (update: APIUpdate) => void;
  [Events.Message]: (message: Message) => void;
}

export interface Caches {
  UserManager: [manager: typeof UserManager, holds: typeof User];
}

export type CacheConstructors = {
  [Cache in keyof Caches]: Caches[Cache][0] & { name: Cache };
};

export type OverriddenCaches = 'DMMessageManager';

export type ManagerType = CacheConstructors[Exclude<
  keyof Caches,
  OverriddenCaches
>];

export type Manager = CacheConstructors[keyof Caches];

export type CacheFactory = (
  managerType: ManagerType,
  holds: Caches[(typeof manager)['name']][1],
  manager: Manager
) => (typeof manager)['prototype'] extends DataManager<
  infer Key,
  infer Value,
  any
>
  ? Collection<Key, Value>
  : never;

export type CacheWithLimitsOptions = {
  [K in keyof Caches]?: Caches[K][0]['prototype'] extends DataManager<
    infer Key,
    infer Value,
    any
  >
    ? LimitedCollectionOptions<Key, Value> | number
    : never;
};
