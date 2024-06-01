/**
 * Regular expression to match and remove comments from JavaScript code.
 * It matches both single-line (// ...) and multi-line (\/* ... *\/) comments.
 */
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
/**
 * Regular expression to match individual argument names.
 * It matches sequences of characters that are not whitespace or commas.
 */
const ARGUMENT_NAMES = /([^\s,]+)/g;

/**
 * Extracts the names of the parameters from a given JavaScript function.
 *
 * @param {Function} func - The function from which to extract parameter names.
 * @returns {string[]} An array of parameter names.
 *
 * @example
 * function exampleFunction(param1: string, param2: number) {}
 * const paramNames = getParamNames(exampleFunction);
 * console.log(paramNames); // ["param1", "param2"]
 */
export function getParamNames<T extends (...args: unknown[]) => unknown>(
  func: T,
): string[] {
  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  const result = fnStr
    .slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
    .match(ARGUMENT_NAMES);
  if (result === null) {
    return [];
  }
  return result;
}
