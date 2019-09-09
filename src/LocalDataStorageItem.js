class LocalDataStorageItem {
  constructor(data) {
    if (data === undefined) throw new ReferenceError('data parameter is missing');
    this.value = data.value || null;
    this.createdDate = data.createdDate === null || data.createdDate === undefined
      ? null : data.createdDate;
    this.expiryDate = data.expiryDate === null || data.expiryDate === undefined
      ? null : data.expiryDate;
  }
}

export default LocalDataStorageItem;
