const mockLocalStorage: Storage = {
	length: 0,
	key: (index: number): string => "",
	getItem: (key: string): string => "",
	setItem: () => {},
	removeItem: () => {},
	clear: () => {},
};

const noLocalStorage = undefined;

const erroredLocalStorage = {
	...mockLocalStorage,
	setItem: () => {
		throw new DOMException("", "QuotaExceededError");
	},
};

const erroredFirefoxLocalStorage = {
	...mockLocalStorage,
	setItem: () => {
		throw new DOMException("", "NS_ERROR_DOM_QUOTA_REACHED");
	},
};

const fullLocalStorage = {
	...mockLocalStorage,
	length: 1,
	setItem: () => {
		throw new DOMException("", "QuotaExceededError");
	},
};

export {
	noLocalStorage,
	erroredLocalStorage,
	erroredFirefoxLocalStorage,
	fullLocalStorage,
};
