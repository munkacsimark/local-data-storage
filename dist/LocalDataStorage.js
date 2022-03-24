import { isLocalStorageAvailable } from "./validator";
const isAvailable = () => isLocalStorageAvailable();
const itemExists = (key) => getItem(key) !== null;
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
const setItem = (key, { value, expiryDate }, forceOverwrite = false) => {
    try {
        if (!forceOverwrite && itemExists(key))
            return false;
        window.localStorage.setItem(key, JSON.stringify({
            value,
            createdDate: Date.now(),
            ...(expiryDate ? { expiryDate } : {}),
        }));
        return true;
    }
    catch (e) {
        throw e;
    }
};
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
export { isAvailable, itemExists, clearExpiredItems, getItem, setItem, removeItem, clear, };
//# sourceMappingURL=LocalDataStorage.js.map