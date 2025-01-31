'use strict';

import { ErrorCodes, ErrorCodesEnum } from './errorCodes.js';
import { Messages } from './messages.js';

/**
 * Extend an error of some sort into a DiscordjsError.
 * @param {Error} Base Base error to extend
 * @returns {TelegramjsError}
 * @ignore
 */
function makeTelegramjsError(Base: ErrorConstructor) {
  return class TelegramjsError extends Base {
    public code: ErrorCodesEnum;
    constructor(code: ErrorCodesEnum, ...args: any) {
      super(message(code, args));
      this.code = code;
      Error.captureStackTrace?.(this, TelegramjsError);
    }

    override get name() {
      return `${super.name} [${this.code}]`;
    }
  };
}

/**
 * Format the message for an error.
 * @param {string} code The error code
 * @param {Array<*>} args Arguments to pass for util format or as function args
 * @returns {string} Formatted string
 * @ignore
 */
function message(code: ErrorCodesEnum, args: any): string {
  if (!(code in ErrorCodes))
    throw new Error('Error code must be a valid DiscordjsErrorCodes');
  const msg = Messages[code];
  if (!msg) throw new Error(`No message associated with error code: ${code}.`);
  if (typeof msg === 'function') return msg(...args);
  if (!args?.length) return msg;
  args.unshift(msg);
  return String(...args);
}

export const TelegramjsError = makeTelegramjsError(Error);
export const TelegramjsTypeError = makeTelegramjsError(TypeError);
export const TelegramjsRangeError = makeTelegramjsError(RangeError);
