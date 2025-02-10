import { ErrorCodes, ErrorCodesEnum } from './errorCodes.js';

export const Messages: Record<ErrorCodesEnum, any> = {
  [ErrorCodes.InvalidToken]: 'An invalid token was provided.',
  [ErrorCodes.ReqResourceType]:
    'The resource must be a string, Buffer or a valid file stream.',

  [ErrorCodes.InvalidType]: (name: string, expected: string, an = false) =>
    `Supplied ${name} is not a${an ? 'n' : ''} ${expected}.`,

  [ErrorCodes.NotImplemented]: (what: string, name: string) =>
    `Method ${what} not implemented on ${name}.`,

  [ErrorCodes.FileNotFound]: (file: any) => `File could not be found: ${file}`,
};
