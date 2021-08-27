"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear = exports.removeItem = exports.setItem = exports.getItem = exports.clearExpiredItems = exports.itemExists = exports.isAvailable = void 0;
const validator_1 = require("./validator");
const isAvailable = () => validator_1.isLocalStorageAvailable();
exports.isAvailable = isAvailable;
const itemExists = (key) => getItem(key) !== null;
exports.itemExists = itemExists;
const clearExpiredItems = () => {
    try {
        const storage = window.localStorage;
        let itemsWasRemoved = false;
        Object.keys(storage).forEach((key) => {
            const storageItem = getItem(key);
            if (storageItem === null ||
                storageItem.expiryDate === undefined ||
                storageItem.expiryDate >= Date.now())
                return;
            storage.removeItem(key);
            itemsWasRemoved = true;
        });
        return itemsWasRemoved;
    }
    catch (e) {
        throw e;
    }
};
exports.clearExpiredItems = clearExpiredItems;
const getItem = (key) => {
    try {
        const rawItem = window.localStorage.getItem(key);
        if (rawItem === null)
            return null;
        try {
            const parsedItem = JSON.parse(rawItem);
            return parsedItem.value === undefined
                ? { value: parsedItem }
                : parsedItem;
        }
        catch (e) {
            return { value: rawItem };
        }
    }
    catch (e) {
        throw e;
    }
};
exports.getItem = getItem;
const setItem = (key, { value, expiryDate }, forceOverwrite = false) => {
    try {
        if (!forceOverwrite && itemExists(key))
            return false;
        window.localStorage.setItem(key, JSON.stringify(Object.assign({ value, createdDate: Date.now() }, (expiryDate ? { expiryDate } : {}))));
        return true;
    }
    catch (e) {
        throw e;
    }
};
exports.setItem = setItem;
const removeItem = (key) => {
    try {
        if (!itemExists(key))
            return false;
        window.localStorage.removeItem(key);
        return true;
    }
    catch (e) {
        throw e;
    }
};
exports.removeItem = removeItem;
const clear = () => {
    try {
        if (window.localStorage.length === 0)
            return false;
        window.localStorage.clear();
        return true;
    }
    catch (e) {
        throw e;
    }
};
exports.clear = clear;
//# sourceMappingURL=LocalDataStorage.js.map