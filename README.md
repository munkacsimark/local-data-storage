# Local Data Storage

It's a simple **wrapper** over browsers native **localStorage**. It uses "smart" items and can work with existing localStorage entries. It always returns success of operation as boolean.

## Installation

```bash
$ npm install local-data-storage
```

## Usage

| Name                  | Parameters                                                         | Description                           | Return value           |
| --------------------- | ------------------------------------------------------------------ | ------------------------------------- | ---------------------- |
| `isAvailable()`       |                                                                    | It tests if localStorage is available | boolean                |
| `itemExists()`        | key: string                                                        | It check existence of an item         | boolean                |
| `clearExpiredItems()` |                                                                    | Clears expired items                  | boolean                |
| `getItem()`           | key: string                                                        | Return an item by key                 | \*LocalDataStorageItem |
| `setItem()`           | key: string, obj: \*LocalDataStorageItem, forceOverwrite?: boolean | Saves an item with given key          | boolean                |
| `removeItem()`        | key: string                                                        | Removes an item by key                | boolean                |
| `clear()`             |                                                                    | Clears the whole storage              | boolean                |

### Examples:

```javascript
import {
	isAvailable,
	itemExists,
	clearExpiredItems,
	getItem,
	setItem,
	removeItem,
	clear,
} from "local-data-storage";

if (isAvailable()) {
	/* do something */
}

if (itemExists("cat")) {
	/* do something */
}

clearExpiredItems();

const myItem = getItem("cat");

setItem("cat", { value: "meow" });
setItem("willExpireCat", { value: "meow", expiryDate: Date.now() + 86_400 });
setItem("cat", { value: "OVERWRITTEN" }, true);

removeItem("cat");

clear();
```

## \*LocalDataStorageItem

| Property    | Type   | Description                                                                                                    |
| ----------- | ------ | -------------------------------------------------------------------------------------------------------------- |
| value       | string | This will always exist, will contain unparseable items from storage as well.                                   |
| createdDate | number | This is a timestamp of creation. It will be set automatically at saving.                                       |
| expiryDate  | number | This is an optional property. It's a timestamp of expiry, will be deleted by `clearExpiredItems()` if expired. |

### Example:

```javascript
{
	value: 'cat',
	createdDate: 86400,
	expiryDate: 86401
}
```
