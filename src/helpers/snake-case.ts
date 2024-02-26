export const toSnakeCase = (str: string): string => {
    return str.replace(/\s+/g, '_').toLowerCase();
  };
  