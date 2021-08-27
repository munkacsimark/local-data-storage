import type LocalDataStorageItem from "./LocalDataStorageItem";
declare const isAvailable: () => boolean;
declare const itemExists: (key: string) => boolean;
declare const clearExpiredItems: () => boolean;
declare const getItem: (key: string) => LocalDataStorageItem | null;
declare const setItem: (key: string, { value, expiryDate }: LocalDataStorageItem, forceOverwrite?: boolean) => boolean;
declare const removeItem: (key: string) => boolean;
declare const clear: () => boolean;
export { isAvailable, itemExists, clearExpiredItems, getItem, setItem, removeItem, clear, };
