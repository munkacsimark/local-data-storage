import LocalDataStorageItem from '../src/LocalDataStorageItem';

test('should throw ReferenceError if it doesn\'t get parameter', () => {
  expect(() => new LocalDataStorageItem()).toThrow(ReferenceError);
});

test('should create an instance correctly with empty parameters', () => {
  const item = new LocalDataStorageItem({});
  expect(item.value).toBeNull();
  expect(item.expiryDate).toBeNull();
  expect(item.createdDate).toBeNull();
});

test('should create an instance correctly', () => {
  const value = '🦄';
  const createdDate = Date.now();
  const expiryDate = createdDate + 1;
  const item = new LocalDataStorageItem({ value, expiryDate, createdDate });
  expect(item.value).toEqual(value);
  expect(item.createdDate).toEqual(createdDate);
  expect(item.expiryDate).toEqual(expiryDate);
});
