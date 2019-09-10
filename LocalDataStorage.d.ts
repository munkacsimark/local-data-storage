interface LocalDataStorageItemData {
  value?: any,
  createdDate?: number,
  expiryDate?: number,
}
export declare class LocalDataStorageItem {
  constructor(data: LocalDataStorageItemData);
  value: any | null;
  createdDate: number | null;
  expiryDate: number | null;
}
export declare class LocalDataStorage {
  getItem(key: string): LocalDataStorageItem;
  setItem(key: string, value: any, expiry?: number, forceOverwrite?: boolean): boolean;
  removeItem(key: string): boolean;
  clear(): boolean;
  readonly isAvailable: boolean;
  itemExists(key: string): boolean;
  cleanExpiredItems(): boolean;
}

export default LocalDataStorage;
