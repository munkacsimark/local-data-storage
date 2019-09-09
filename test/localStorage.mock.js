const localStorage = () => ({
  length: 0,
  key: () => {},
  getItem: () => {},
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
});

const emptyLocalStorage = () => undefined;

const notFirefoxLocalStorage = () => Object
  .assign({}, localStorage(), {
    setItem: () => {
      throw new DOMException('', 'QuotaExceededError');
    },
  });

const firefoxLocalStorage = () => Object
  .assign({}, localStorage(), {
    setItem: () => {
      throw new DOMException('', 'NS_ERROR_DOM_QUOTA_REACHED');
    },
  });

const fullLocalStorage = () => Object
  .assign({}, localStorage(), {
    length: 1,
    setItem: () => {
      throw new DOMException('', 'QuotaExceededError');
    },
  });

export {
  emptyLocalStorage,
  notFirefoxLocalStorage,
  firefoxLocalStorage,
  fullLocalStorage,
};
