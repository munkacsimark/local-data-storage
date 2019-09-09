import isLocalStorageAvailable from '../src/validator';
import {
  emptyLocalStorage,
  notFirefoxLocalStorage,
  firefoxLocalStorage,
  fullLocalStorage,
} from './localStorage.mock';

const originalLocalStorage = global.localStorage;
const setLocalStorage = mockLocalStorage => Object
  .defineProperty(global, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
const resetLocalStorage = () => Object
  .defineProperty(global, 'localStorage', {
    value: originalLocalStorage,
    writable: true,
  });

afterEach(() => resetLocalStorage());

test('should return false if there isn\'t localStorage on window', () => {
  setLocalStorage(emptyLocalStorage());
  expect(isLocalStorageAvailable()).toBeFalsy();
});

test('should return false when browser (except Firefox) doesn\'t support localStorage or Safari lies about it in private mode (<iOS11)', () => {
  setLocalStorage(notFirefoxLocalStorage(global));
  expect(isLocalStorageAvailable()).toBeFalsy();
});

test('should return false if Firefox doesn\'t support localStorage', () => {
  setLocalStorage(firefoxLocalStorage());
  expect(isLocalStorageAvailable()).toBeFalsy();
});

test('should return true if the localStorage is full but it\'s available', () => {
  setLocalStorage(fullLocalStorage());
  expect(isLocalStorageAvailable()).toBeTruthy();
});

test('should return true if the localStorage is fully working', () => {
  expect(isLocalStorageAvailable()).toBeTruthy();
});
