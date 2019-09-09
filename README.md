# Local Storage Handler

A simple **wrapper** over browsers native **localStorage** which saves "smart" items, can handle expiration and can get rid of expired items.

## Installation

```bash
$ npm install local-data-storage
```

## Usage

```javascript
import LocalDataStorage from 'local-data-storage';
// or
import { LocalDataStorage, LocalDataStorageItem } from 'local-data-storage';

// store singleton:
const storage = new LocalDataStorage();

// save an item
const expiry = Date.now() + 86400;
storage.setItem('🔑', '🐈', expiry);
```

---

## About LocalStorageHandler
`LocalStorageHandler` will be a **singleton**. In its constructor it validates existence/availability of the `localStorage` object on `window`. If localStorage isn't supported the `storage` property will be `null` and regular localStorage methods will return with `TypeError` so its recommended to wrap this methods into *try-catch* blocks. By default `setItem` method cannot overwrites an item if it exists. Every method returns a boolean instead of undefined which shows success or doing nothing.

### Properites
`storage` - The browsers native *localStorage* object. Please don't modify it from outside.

### Getters
`isAvailable` - Returns availability of native localStorage feature.

### Methods
`getItem` - Returns a custom *LocalStorageItem* or null.

`setItem` - It checks existence of the key, and only overwites it when the *forceOverwrite* parameter is set to *true*. You can pass the *expiry* parameter as well, it will be removed when it expires.

`removeItem` - Removes an item from storage.

`clear` - Wipes everything out of storage.

`itemExists` - Checks existence of an item based on its *key*.

`cleanExpiredItems` - Removes expired items from the storage. It is invoked in the *constructor*, but feel free to use it anywhere.

---

## About LocalStorageItem
`LocalStorageItem` is a custom object stored stringified in localStorage. Its `value` will be the parsed *array* or *object* or just a string. `LocalStorageHandler`s `getItem` method gives this object back, and `setItem` method creates it before saving stuff into localStorage.

### Properties
`value` - The parsed value of stored data. It can be *array*, *object* or a simple *string* as well.

`createdDate` - The timestamp of creation. Its generated automatically in *LocalStorageHandler*s *setItem* method. Don't modify it.

`expiryDate` - The timestamp of expiration, it can be set from *LocalStorageHandler*s *setItem* method or later. When an item expires it will be removed by *LocalStorageHandler*s *cleanExpiredItems* method which is called in *constructor* too.
