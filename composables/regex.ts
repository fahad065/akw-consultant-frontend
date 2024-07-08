export const useRegexUnderScore = (value: String = '') => {
  return value.replace(/_/g, " ");
};
