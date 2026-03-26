
export const hasNonEnglishScript = (text: string): boolean => {
  return /[^\x00-\x7F]/.test(text);
};