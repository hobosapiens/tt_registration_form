export const debounce = (func, delay) => {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export const isStringContainsNumber = (value) => {
  return /\d/.test(value);
}

export const isStringContainsCapitalLetter = (value) => {
  return /[А-ЯA-Z]/.test(value);
}

export const isStringContainsSmallLetter = (value) => {
  return /[а-яa-z]/.test(value);
}
