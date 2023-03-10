export const camelCaseToUpperCase = (str: string | null) => {
  if (str == null) return null;
  return str.replace(/([a-z])([A-Z])/, '$1_$2').toUpperCase();
};
