import { ErrorCodes, ErrorCodesEnum } from './errorCodes.js';

export const Messages: Record<ErrorCodesEnum, any> = {
  [ErrorCodes.InvalidType]: 'Invalid type',
  [ErrorCodes.InvalidToken]: 'Invalid token',
};
