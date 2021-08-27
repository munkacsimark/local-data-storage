/**
 * @jest-environment jsdom
 */

import {
	clear,
	clearExpiredItems,
	getItem,
	itemExists,
	removeItem,
	setItem,
} from "../src/LocalDataStorage";
import LocalDataStorageItem from "../src/LocalDataStorageItem";

describe("LocalDataStorage", () => {
	beforeEach(() => window.localStorage.clear());

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
});

/*
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
*/
