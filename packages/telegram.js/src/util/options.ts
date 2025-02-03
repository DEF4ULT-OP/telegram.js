import { DefaultRestOptions, RESTOptions } from '@telegramjs/rest';

export interface PollingOptions {
  enabled: boolean;
  interval: number;
  offset: number | null;
}
export interface ClientOptions {
  polling: PollingOptions;
  rest: RESTOptions;
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
    };
  }
}
