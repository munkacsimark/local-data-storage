/**
 * @jest-environment jsdom
 */

import {
  isAvailable,
  clear,
  clearExpiredItems,
  getItem,
  itemExists,
  removeItem,
  setItem,
} from "../src/LocalDataStorage";
import LocalDataStorageItem from "../src/LocalDataStorageItem";
import {
  noLocalStorage,
  erroredLocalStorage,
  erroredFirefoxLocalStorage,
  fullLocalStorage,
} from "./localStorage.mock";

describe("LocalDataStorage", () => {
  beforeEach(() => window.localStorage?.clear());

  describe("itemExists()", () => {
    test("should return true if so", () => {
      const key = "cat";
      window.localStorage.setItem(
        key,
        JSON.stringify(<LocalDataStorageItem>{ value: "meow" })
      );
      expect(itemExists(key)).toBeTruthy();
    });

    test("should return false if not", () => {
      const key = "cat";
      const wrongKey = "wrongCat";
      window.localStorage.setItem(
        key,
        JSON.stringify(<LocalDataStorageItem>{ value: "meow" })
      );
      expect(itemExists(wrongKey)).toBeFalsy();
    });
  });

  describe("clearExpiredItems()", () => {
    test("should clear expired items", () => {
      const expiredKey = "expiredCat";
      const expiredValue = "meow";
      window.localStorage.setItem(
        expiredKey,
        JSON.stringify(<LocalDataStorageItem>{
          value: expiredValue,
          expiryDate: Date.now() - 86_400,
        })
      );
      expect(
        JSON.parse(window.localStorage.getItem(expiredKey) || "").value
      ).toEqual(expiredValue);
      clearExpiredItems();
      expect(window.localStorage.getItem(expiredKey)).toBeNull();
    });

    test("should keep non-expired or permanent items", () => {
      const notExpiredYetKey = "notExpiredCat";
      const permanentKey = "permanentCat";
      const notExpiredValue = "notExpiredMeow";
      const permanentValue = "permanentMeow";
      window.localStorage.setItem(
        notExpiredYetKey,
        JSON.stringify(<LocalDataStorageItem>{
          value: notExpiredValue,
          expiryDate: Date.now() + 86_400,
        })
      );
      window.localStorage.setItem(
        permanentKey,
        JSON.stringify(<LocalDataStorageItem>{
          value: permanentValue,
        })
      );
      clearExpiredItems();
      expect(
        JSON.parse(window.localStorage.getItem(notExpiredYetKey) || "").value
      ).toEqual(notExpiredValue);
      expect(
        JSON.parse(window.localStorage.getItem(permanentKey) || "").value
      ).toEqual(permanentValue);
    });

    test("should return true or false based on operation success", () => {
      expect(clearExpiredItems()).toBeFalsy();
      window.localStorage.setItem(
        "cat",
        JSON.stringify(<LocalDataStorageItem>{
          value: "cat",
        })
      );
      expect(clearExpiredItems()).toBeFalsy();
      window.localStorage.setItem(
        "notExpiredCat",
        JSON.stringify(<LocalDataStorageItem>{
          value: "cat",
          expiryDate: Date.now() + 86_400,
        })
      );
      expect(clearExpiredItems()).toBeFalsy();
      window.localStorage.setItem(
        "expiredCat",
        JSON.stringify(<LocalDataStorageItem>{
          value: "cat",
          expiryDate: Date.now() - 86_400,
        })
      );
      expect(clearExpiredItems()).toBeTruthy();
    });
  });

  describe("getItem()", () => {
    test("should return null if there is no item", () => {
      expect(getItem("cat")).toBeNull();
    });

    test("should return item correctly", () => {
      const stringItemKey = "stringCat";
      const stringItem = "meow";
      const arrayItemKey = "arrayCat";
      const arrayItem = ["cat", 0, { cat: "meow" }];
      const objectItemKey = "objectCat";
      const objectItem = { cat: "meow", 0: 1 };

      window.localStorage.setItem(
        stringItemKey,
        JSON.stringify(<LocalDataStorageItem>{
          value: stringItem,
        })
      );
      expect(getItem(stringItemKey)?.value).toEqual(stringItem);

      window.localStorage.setItem(
        arrayItemKey,
        JSON.stringify(<LocalDataStorageItem>{
          value: arrayItem,
        })
      );
      expect(getItem(arrayItemKey)?.value).toEqual(arrayItem);

      window.localStorage.setItem(
        objectItemKey,
        JSON.stringify(<LocalDataStorageItem>{
          value: objectItem,
        })
      );
      expect(getItem(objectItemKey)?.value).toEqual(objectItem);
    });

    test("should return raw value if it's an item with unknown format", () => {
      const unknownItemKey = "unknownCat";
      const unparseableItemKey = "unparseableCat";
      const unknownItemValue = "unknownMeow";
      const unparseableItemValue = "unparseableMeow";

      window.localStorage.setItem(
        unknownItemKey,
        JSON.stringify([unknownItemValue])
      );
      expect(getItem(unknownItemKey)?.value).toEqual([unknownItemValue]);

      window.localStorage.setItem(unparseableItemKey, unparseableItemValue);
      expect(getItem(unparseableItemKey)?.value).toEqual(unparseableItemValue);
    });
  });

  describe("setItem()", () => {
    test("should set item correctly", () => {
      const key = "cat";
      const value: LocalDataStorageItem = { value: "meow" };
      const keyWithExpiry = "expiryCat";
      const valueWithExpiry: LocalDataStorageItem = {
        value: "meow",
        expiryDate: 1,
      };
      const expectedPattern: RegExp = /{"value":"meow","createdDate":\d{13,}}/;
      const expectedPatternWithExpiry: RegExp =
        /{"value":"meow","createdDate":\d{13,},"expiryDate":1}/;
      setItem(key, value);
      expect(window.localStorage.getItem(key)).toMatch(expectedPattern);
      setItem(keyWithExpiry, valueWithExpiry);
      expect(window.localStorage.getItem(keyWithExpiry)).toMatch(
        expectedPatternWithExpiry
      );
    });
    test("should handle forceOverwrite correctly", () => {
      const key = "cat";
      const value: LocalDataStorageItem = { value: "meow" };
      const overwriteValue: LocalDataStorageItem = { value: "overWrittenMeow" };
      const expectedPatternNoOverwrite: RegExp =
        /{"value":"meow","createdDate":\d{13,}}/;
      const expectedPatternOverwrite: RegExp =
        /{"value":"overWrittenMeow","createdDate":\d{13,}}/;
      setItem(key, value);
      setItem(key, overwriteValue);
      expect(window.localStorage.getItem(key)).toMatch(
        expectedPatternNoOverwrite
      );
      setItem(key, overwriteValue, true);
      expect(window.localStorage.getItem(key)).toMatch(
        expectedPatternOverwrite
      );
    });
    test("should return true or false based on operation success", () => {
      const key = "cat";
      const value: LocalDataStorageItem = { value: "meow" };
      expect(
        setItem("cat", <LocalDataStorageItem>{ value: "meow" })
      ).toBeTruthy();
      expect(
        setItem("cat", <LocalDataStorageItem>{ value: "woooff" })
      ).toBeFalsy();
      expect(
        setItem("cat", <LocalDataStorageItem>{ value: "woooff" }, true)
      ).toBeTruthy();
    });
  });

  describe("removeItem()", () => {
    test("should remove item", () => {
      const keyToRemove = "cat";
      window.localStorage.setItem(
        keyToRemove,
        JSON.stringify(<LocalDataStorageItem>{
          value: "meow",
        })
      );
      removeItem(keyToRemove);
      expect(window.localStorage.getItem(keyToRemove)).toBeNull();
    });

    test("should return true or false based on operation success", () => {
      const key = "cat";
      window.localStorage.setItem(
        key,
        JSON.stringify(<LocalDataStorageItem>{
          value: "meow",
        })
      );
      expect(removeItem("notExistingKey")).toBeFalsy();
      expect(removeItem(key)).toBeTruthy();
    });
  });

  describe("clear()", () => {
    test("should clear storage", () => {
      window.localStorage.setItem(
        "cat",
        JSON.stringify(<LocalDataStorageItem>{
          value: "meow",
        })
      );
      clear();
      expect(window.localStorage.length).toEqual(0);
    });
    test("should return true or false based on operation success", () => {
      expect(clear()).toBeFalsy();
      window.localStorage.setItem(
        "cat",
        JSON.stringify(<LocalDataStorageItem>{
          value: "meow",
        })
      );
      expect(clear()).toBeTruthy();
    });
  });

  // this should be the last, because localStorage is being overwritten here
  describe("isLocalStorageAvailable", () => {
    const setLocalStorage = (mockLocalStorage: Storage | undefined) =>
      Object.defineProperty(window, "localStorage", {
        value: mockLocalStorage,
        writable: true,
      });

    it("should return false if localStorage isn't exists", () => {
      setLocalStorage(noLocalStorage);
      expect(isAvailable()).toBeFalsy();
    });

    it("should return false when browser (except Firefox) doesn't support localStorage or Safari lies about it in private mode (<iOS11)", () => {
      setLocalStorage(erroredLocalStorage);
      expect(isAvailable()).toBeFalsy();
    });

    it("should return false if Firefox doesn't support localStorage", () => {
      setLocalStorage(erroredFirefoxLocalStorage);
      expect(isAvailable()).toBeFalsy();
    });

    it("should return true if the localStorage is full but it's available", () => {
      setLocalStorage(fullLocalStorage);
      expect(isAvailable()).toBeTruthy();
    });

    it("should return true if the localStorage is fully working", () => {
      expect(isAvailable()).toBeTruthy();
    });
  });
});
