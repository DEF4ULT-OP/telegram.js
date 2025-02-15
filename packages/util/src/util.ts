export const isValidUrl = (url: unknown): boolean => {
  if (typeof url === 'string' && /^https?:\/\//.test(url)) {
    return true;
  }

  return false;
};
