export const normalizeEmail = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.toLowerCase().trim() : value;
