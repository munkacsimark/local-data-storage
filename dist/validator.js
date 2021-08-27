"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLocalStorageAvailable = void 0;
const isLocalStorageAvailable = () => {
    const storage = window.localStorage;
    try {
        const testItem = "__storage_test__";
        storage.setItem(testItem, testItem);
        storage.removeItem(testItem);
        return true;
    }
    catch (e) {
        return (e instanceof DOMException &&
            (e.code === 22 ||
                e.code === 1014 ||
                e.name === "QuotaExceededError" ||
                e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            storage &&
            storage.length !== 0);
    }
};
exports.isLocalStorageAvailable = isLocalStorageAvailable;
//# sourceMappingURL=validator.js.map