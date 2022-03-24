import type LocalDataStorageItem from "./LocalDataStorageItem.js";

const isAvailable = (): boolean => {
	const storage: Storage = window.localStorage;
	try {
		const testItem: string = "__storage_test__";
		storage.setItem(testItem, testItem);
		storage.removeItem(testItem);
		return true;
	} catch (e) {
		return (
			e instanceof DOMException &&
			(e.code === 22 ||
				e.code === 1014 ||
				e.name === "QuotaExceededError" ||
				e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
			storage &&
			storage.length !== 0
		);
	}
};

const itemExists = (key: string): boolean => getItem(key) !== null;

const clearExpiredItems = (): boolean => {
	try {
		const storage = window.localStorage;
		let itemsWasRemoved: boolean = false;
		Object.keys(storage).forEach((key) => {
			const storageItem: LocalDataStorageItem | null = getItem(key);
			if (
				storageItem === null ||
				storageItem.expiryDate === undefined ||
				storageItem.expiryDate >= Date.now()
			)
				return;
			storage.removeItem(key);
			itemsWasRemoved = true;
		});
		return itemsWasRemoved;
	} catch (e) {
		throw e;
	}
};

const getItem = (key: string): LocalDataStorageItem | null => {
	try {
		const rawItem = window.localStorage.getItem(key);
		if (rawItem === null) return null;
		try {
			const parsedItem = JSON.parse(rawItem);
			return parsedItem.value === undefined
				? <LocalDataStorageItem>{ value: parsedItem }
				: parsedItem;
		} catch (e) {
			return <LocalDataStorageItem>{ value: rawItem };
		}
	} catch (e) {
		throw e;
	}
};

const setItem = (
	key: string,
	{ value, expiryDate }: LocalDataStorageItem,
	forceOverwrite: boolean = false
): boolean => {
	try {
		if (!forceOverwrite && itemExists(key)) return false;
		window.localStorage.setItem(
			key,
			JSON.stringify(<LocalDataStorageItem>{
				value,
				createdDate: Date.now(),
				...(expiryDate ? { expiryDate } : {}),
			})
		);
		return true;
	} catch (e) {
		throw e;
	}
};

const removeItem = (key: string): boolean => {
	try {
		if (!itemExists(key)) return false;
		window.localStorage.removeItem(key);
		return true;
	} catch (e) {
		throw e;
	}
};

const clear = (): boolean => {
	try {
		if (window.localStorage.length === 0) return false;
		window.localStorage.clear();
		return true;
	} catch (e) {
		throw e;
	}
};

export {
	isAvailable,
	itemExists,
	clearExpiredItems,
	getItem,
	setItem,
	removeItem,
	clear,
};
