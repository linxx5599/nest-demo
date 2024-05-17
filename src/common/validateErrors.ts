import { isObject } from './share';
export const validateErrors = (errors) => {
  const errs = errors.reduce((result, err) => {
    const constraints = err.constraints;
    if (isObject(constraints)) {
      for (const key in constraints) {
        result += `${constraints[key]} `;
      }
    }
    return result;
  }, '');
  return errs;
};
