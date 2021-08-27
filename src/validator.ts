const isLocalStorageAvailable = (): boolean => {
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

export { isLocalStorageAvailable };
