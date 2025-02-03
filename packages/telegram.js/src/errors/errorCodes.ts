const keys = ['InvalidType', 'InvalidToken', 'NotImplemented'] as const;

export const ErrorCodes = Object.fromEntries(keys.map((key) => [key, key])) as {
  [K in (typeof keys)[number]]: K;
};

export type ErrorCodesEnum = (typeof ErrorCodes)[keyof typeof ErrorCodes];
