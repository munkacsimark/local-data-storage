import isLocalStorageAvailable from './validator';
import LocalDataStorageItem from './LocalDataStorageItem';

class LocalDataStorage {
  constructor() {
    if (LocalDataStorage.instance) return LocalDataStorage.instance;
    LocalDataStorage.instance = this;
    this.storage = isLocalStorageAvailable() ? window.localStorage : null;
    if (this.isAvailable) this.cleanExpiredItems();
    return this;
  }

  getItem = (key) => {
    try {
      const rawItem = this.storage.getItem(key);
      if (rawItem === null) return null;
      try {
        const parsedItem = JSON.parse(rawItem);
        return parsedItem.value === undefined
          ? new LocalDataStorageItem({ value: rawItem })
          : new LocalDataStorageItem(parsedItem);
      } catch (e) { return new LocalDataStorageItem({ value: rawItem }); }
    } catch (exception) { throw exception; }
  }

  setItem = (key, value, expiry = null, forceOverwrite = false) => {
    try {
      if (forceOverwrite !== true && this.itemExists(key)) return false;
      this.storage.setItem(key, JSON.stringify({
        createdDate: Date.now(),
        expiryDate: expiry,
        value,
      }));
      return true;
    } catch (exception) { throw exception; }
  }

  removeItem = (key) => {
    try {
      if (!this.itemExists(key)) return false;
      this.storage.removeItem(key);
      return true;
    } catch (exception) { throw exception; }
  }

  clear = () => {
    try {
      this.storage.clear();
      return true;
    } catch (exception) { throw exception; }
  }

  get isAvailable() { return this.storage !== null; }

  itemExists = key => this.getItem(key) !== null;

  cleanExpiredItems = () => {
    let itemsWasRemoved = false;
    for (let i = 0; i < this.storage.length; i += 1) {
      const key = this.storage.key(i);
      const { expiryDate } = this.getItem(key);
      if (expiryDate !== null && expiryDate < Date.now()) {
        this.removeItem(key);
        itemsWasRemoved = true;
      }
    }
    return itemsWasRemoved;
  }
}

export default LocalDataStorage;
