/**
 * @jest-environment jsdom
 */

import { isLocalStorageAvailable } from "../src/validator";
import {
	noLocalStorage,
	erroredLocalStorage,
	erroredFirefoxLocalStorage,
	fullLocalStorage,
} from "./localStorage.mock";

describe("isLocalStorageAvailable", () => {
	const setLocalStorage = (mockLocalStorage: Storage | undefined) =>
		Object.defineProperty(window, "localStorage", {
			value: mockLocalStorage,
			writable: true,
		});

	it("should return false if localStorage isn't exists", () => {
		setLocalStorage(noLocalStorage);
		expect(isLocalStorageAvailable()).toBeFalsy();
	});

	it("should return false when browser (except Firefox) doesn't support localStorage or Safari lies about it in private mode (<iOS11)", () => {
		setLocalStorage(erroredLocalStorage);
		expect(isLocalStorageAvailable()).toBeFalsy();
	});

	it("should return false if Firefox doesn't support localStorage", () => {
		setLocalStorage(erroredFirefoxLocalStorage);
		expect(isLocalStorageAvailable()).toBeFalsy();
	});

	it("should return true if the localStorage is full but it's available", () => {
		setLocalStorage(fullLocalStorage);
		expect(isLocalStorageAvailable()).toBeTruthy();
	});

	it("should return true if the localStorage is fully working", () => {
		expect(isLocalStorageAvailable()).toBeTruthy();
	});
});
