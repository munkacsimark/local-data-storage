/**
 * @jest-environment jsdom
 */

import LocalDataStorage from "../src/LocalDataStorage";
import LocalDataStorageItem from "../src/LocalDataStorageItem";

const originalLocalStorage = global.localStorage;
const disableLocalStorage = () =>
  Object.defineProperty(global, "localStorage", {
    value: undefined,
    writable: true,
  });
const enableLocalStorage = () =>
  Object.defineProperty(global, "localStorage", {
    value: originalLocalStorage,
    writable: true,
  });

afterEach(() => {
  LocalDataStorage.instance = undefined;
  global.localStorage.clear();
});

describe("constructor", () => {
  test("it should be a singleton", () => {
    const localDataStorage = new LocalDataStorage();
    const uniquePropertyValue = "🦄";
    localDataStorage.uniqueProperty = uniquePropertyValue;
    const anotherLocalDataStorage = new LocalDataStorage();
    expect(anotherLocalDataStorage.uniqueProperty).toEqual(uniquePropertyValue);
  });

  test("it's storage must be null if localStorage isn't available", () => {
    disableLocalStorage();
    const localDataStorage = new LocalDataStorage();
    expect(localDataStorage.storage).toBeNull();
    enableLocalStorage();
  });
});

describe("getter isAvailable", () => {
  test("works", () => {
    const localDataStorage = new LocalDataStorage();
    localDataStorage.storage = null;
    expect(localDataStorage.isAvailable).toBeFalsy();
    localDataStorage.storage = {};
    expect(localDataStorage.isAvailable).toBeTruthy();
  });
});

describe("method getItem", () => {
  test("if something goes wrong throws an exception", () => {
    disableLocalStorage();
    const localDataStorage = new LocalDataStorage();
    expect(() => localDataStorage.getItem("🔑")).toThrow(TypeError);
    enableLocalStorage();
  });

  test("should handle foreign items", () => {
    const itemKey = "🔑";
    const itemKey2 = "🗝";
    const parseableValue = '{"📦":["🐷","🐮","🐰"]}';
    const justAStringValue = "¯\\_(ツ)_/¯";
    global.localStorage.setItem(itemKey, parseableValue);
    global.localStorage.setItem(itemKey2, justAStringValue);
    const localDataStorage = new LocalDataStorage();
    const returnedItem = localDataStorage.getItem(itemKey);
    expect(returnedItem.value).toEqual(parseableValue);
    const returnedItem2 = localDataStorage.getItem(itemKey2);
    expect(returnedItem2.value).toEqual(justAStringValue);
  });

  test("should return null if item doesn't exist", () => {
    const localDataStorage = new LocalDataStorage();
    expect(localDataStorage.getItem("macska")).toBeNull();
  });

  test("should return the item correctly", () => {
    const itemKey = "🔑";
    const itemValue = "🐈";
    global.localStorage.setItem(itemKey, JSON.stringify({ value: itemValue }));
    const localDataStorage = new LocalDataStorage();
    const returnedItem = localDataStorage.getItem(itemKey);
    expect(returnedItem instanceof LocalDataStorageItem).toBeTruthy();
    expect(returnedItem.value).toEqual(itemValue);
  });
});

describe("method setItem", () => {
  test("if something goes wrong throws an exception", () => {
    disableLocalStorage();
    const localDataStorage = new LocalDataStorage();
    expect(() => localDataStorage.setItem("🔑", "🐈")).toThrow(TypeError);
    enableLocalStorage();
  });

  test("should return false when item already exists and it isn't forced", () => {
    const itemKey = "🔑";
    const itemValue = "🐈";
    global.localStorage.setItem(itemKey, JSON.stringify({ value: itemValue }));
    const localDataStorage = new LocalDataStorage();
    const returnedBool = localDataStorage.setItem(itemKey, "🐱");
    expect(returnedBool).toBeFalsy();
    const storedItem = JSON.parse(global.localStorage.getItem(itemKey));
    expect(storedItem.value).toEqual(itemValue);
  });

  test("should return true when saving was successful", () => {
    const itemKey = "🔑";
    const newItemValue = "🐱";
    global.localStorage.setItem(itemKey, JSON.stringify({ value: "🐈" }));
    const localDataStorage = new LocalDataStorage();
    const returnedBool = localDataStorage.setItem(
      itemKey,
      newItemValue,
      null,
      true
    );
    expect(returnedBool).toBeTruthy();
    const storedItem = JSON.parse(global.localStorage.getItem(itemKey));
    expect(storedItem.value).toEqual(newItemValue);
  });

  test("should handle input parameters correctly", () => {
    const itemKey = "🔑";
    const itemValue = "🐈";
    const expiry = Date.now();
    const localDataStorage = new LocalDataStorage();
    const returnedBool = localDataStorage.setItem(itemKey, itemValue, expiry);
    expect(returnedBool).toBeTruthy();
    const storedItem = JSON.parse(global.localStorage.getItem(itemKey));
    expect(storedItem.value).toEqual(itemValue);
    expect(storedItem.expiryDate).toEqual(expiry);
  });
});

describe("method removeItem", () => {
  test("if something goes wrong throws an exception", () => {
    disableLocalStorage();
    const localDataStorage = new LocalDataStorage();
    expect(() => localDataStorage.removeItem("🔑")).toThrow(TypeError);
    enableLocalStorage();
  });

  test("should return false when the item doesn't exist", () => {
    const localDataStorage = new LocalDataStorage();
    const returnedBool = localDataStorage.removeItem("🔑");
    expect(returnedBool).toBeFalsy();
  });

  test("should return true and remove item when it exists", () => {
    const itemKey = "🔑";
    global.localStorage.setItem(itemKey, JSON.stringify({ value: "🐈" }));
    const localDataStorage = new LocalDataStorage();
    const returnedBool = localDataStorage.removeItem(itemKey);
    expect(returnedBool).toBeTruthy();
    const removedItem = global.localStorage.getItem(itemKey);
    expect(removedItem).toBeNull();
  });
});

describe("method clear", () => {
  test("if something goes wrong throws an exception", () => {
    disableLocalStorage();
    const localDataStorage = new LocalDataStorage();
    expect(() => localDataStorage.clear()).toThrow(TypeError);
    enableLocalStorage();
  });

  test("should return true and wipe the storage out", () => {
    global.localStorage.setItem("🔑", JSON.stringify({ value: "🐈" }));
    const localDataStorage = new LocalDataStorage();
    const returnedBool = localDataStorage.clear();
    expect(returnedBool).toBeTruthy();
    expect(global.localStorage.length).toEqual(0);
  });
});

describe("method itemExists", () => {
  test("should return true if the item exists", () => {
    const itemKey = "🔑";
    global.localStorage.setItem(itemKey, JSON.stringify({ value: "🐈" }));
    const localDataStorage = new LocalDataStorage();
    const returnedBool = localDataStorage.itemExists(itemKey);
    expect(returnedBool).toBeTruthy();
  });

  test("should return false if the item doesn't exist", () => {
    const localDataStorage = new LocalDataStorage();
    const returnedBool = localDataStorage.itemExists("🔑");
    expect(returnedBool).toBeFalsy();
  });
});

describe("method clearExpiredItems", () => {
  test("should return false if there was no deletion", () => {
    const localDataStorage = new LocalDataStorage();
    const returnedBool = localDataStorage.clearExpiredItems();
    expect(returnedBool).toBeFalsy();
  });

  test("should return true if there was one or more deletion", () => {
    const localDataStorage = new LocalDataStorage();
    global.localStorage.setItem(
      "🔑",
      JSON.stringify({
        value: "🐈",
        expiryDate: 0,
      })
    );
    const returnedBool = localDataStorage.clearExpiredItems();
    expect(returnedBool).toBeTruthy();
  });

  test("should remove only validated expired items", () => {
    const oneDayTimestamp = 86400;
    const notExpiredItemKey = "🔑";
    const expiredItemKey = "🗝";
    const foreignItemKey = "⛺️";
    const nullExpiryItemKey = "👻";
    const notExpiredTime = Date.now() + oneDayTimestamp;
    const expiredTime = Date.now() - oneDayTimestamp;
    const valueOfAll = "💩";
    global.localStorage.setItem(
      notExpiredItemKey,
      JSON.stringify({
        value: valueOfAll,
        expiryDate: notExpiredTime,
      })
    );
    global.localStorage.setItem(
      expiredItemKey,
      JSON.stringify({
        value: valueOfAll,
        expiryDate: expiredTime,
      })
    );
    global.localStorage.setItem(foreignItemKey, valueOfAll);
    global.localStorage.setItem(
      nullExpiryItemKey,
      JSON.stringify({ value: valueOfAll })
    );
    const localDataStorage = new LocalDataStorage();
    const expiredItem = global.localStorage.getItem(expiredItemKey);
    expect(expiredItem).toBeNull();
    expect(global.localStorage.length).toEqual(3);
  });
});
