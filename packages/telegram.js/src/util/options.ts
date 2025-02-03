import { DefaultRestOptions, RESTOptions } from '@telegramjs/rest';
import { Collection } from '@telegramjs/collection';
import {
  CacheFactory,
  CacheWithLimitsOptions,
  ManagerType,
  Manager,
} from './types';
import { LimitedCollection } from './LimitedCollection';

export interface PollingOptions {
  enabled: boolean;
  interval: number;
  offset: number | null;
}

export interface ClientOptions {
  polling: PollingOptions;
  rest: RESTOptions;
  makeCache: CacheFactory;
}

export class Options extends null {
  static createDefault(): ClientOptions {
    return {
      polling: {
        enabled: true,
        interval: 1000 * 3,
        offset: null,
      },
      rest: DefaultRestOptions,
      makeCache: this.cacheWithLimits(this.DefaultMakeCacheSettings),
    };
  }

  static get DefaultMakeCacheSettings(): CacheWithLimitsOptions {
    return {
      // UserManager: 200,
    };
  }

  static cacheWithLimits(settings: CacheWithLimitsOptions = {}): CacheFactory {
    return (managerType: ManagerType, _: any, manager: Manager) => {
      const setting = settings[manager.name] ?? settings[managerType.name];

      if (setting == null) {
        return new Collection();
      }
      if (typeof setting === 'number') {
        if (setting === Infinity) {
          return new Collection();
        }
        return new LimitedCollection({ maxSize: 0 });
      }

      const noLimit = setting.maxSize == null || setting.maxSize === Infinity;
      if (noLimit) {
        return new Collection();
      }
      return new LimitedCollection(setting);
    };
  }
}
