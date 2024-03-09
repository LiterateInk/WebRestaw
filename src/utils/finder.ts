export const findValueBetween = (plain: string, start: string, end: string): string => {
  const startIndex = plain.indexOf(start) + start.length;
  const endIndex = plain.indexOf(end, startIndex);
  return plain.slice(startIndex, endIndex);
};
