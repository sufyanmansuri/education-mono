const createDebounce = () => {
  let timeout: number;
  return function (fnc: () => void, delay = 300) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fnc();
    }, delay);
  };
};
export const debounce = createDebounce();
