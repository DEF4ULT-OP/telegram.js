'use strict';

import { APIUpdateOptions } from '@telegramjs/rest';
import { Client } from './Client.js';

/**
 * The polling client that is used to poll updates from telegram at specific intervals.
 */
export class PollingClient {
  public offset: number | undefined;
  private timeout: NodeJS.Timeout | undefined;

  constructor(private readonly client: Client) {}

  /**
   * Starts API polling
   * @returns {boolean}
   */
  start(): boolean {
    this.poll();
    return true;
  }

  /**
   * Stops polling if running
   */
  stop() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  async poll() {
    const options: APIUpdateOptions = {};

    if (this.offset) {
      options['offset'] = this.offset;
    }

    try {
      const updates = await this.client.api.getUpdates(options);

      if (updates.length) {
        this.offset = updates[updates.length - 1]!.update_id + 1;
      }

      for (const update of updates) {
        this.client.updater.process(update);
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.timeout = setTimeout(() => {
        this.poll();
      }, this.client.options.polling.interval);
    }
  }
}
