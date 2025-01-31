import { DefaultRestOptions, RESTOptions } from '@telegramjs/rest';

export interface ClientOptions {
  rest: RESTOptions;
}

export class Options extends null {
  static createDefault(): ClientOptions {
    return {
      rest: DefaultRestOptions,
    };
  }
}
