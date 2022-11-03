/**
 * Validate input string for forbidden characters.
 * @param {string} value.
 * Input string.
 * @param {boolean} space.
 * Include empty space and coma validation.
 */
export const validateInputOnForbiddenSymbols = (
  value: string,
  space = false
) => {
  const regExt = new RegExp(
    `(\\}|\\{|\\[|\\]|\\<|\\>|\\!|\\#|\\$|\\%|\\^|\\*|\\&${
      space ? '|\\s|\\,' : ''
    })`
  );
  return !!(value && !regExt.test(value));
};

/**
 * Validate input using regExt rule.
 * @param {string} value.
 * Input string.
 * @param {string} rule.
 * RegExt rule.
 */
export const validateInputOnRegExtension = (value: string, rule: RegExp) => {
  const regExt = new RegExp(rule);
  return !!(value && regExt.test(value));
};
