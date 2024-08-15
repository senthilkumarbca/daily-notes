class IndexedDBHandler {
  constructor(dbName, version) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  async openDB() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("expenses")) {
          const store = db.createObjectStore("expenses", {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("date", "date", { unique: false });
          store.createIndex("category", "category", { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject(`Database error: ${event.target.errorCode}`);
      };
    });
  }

  async addRecord(storeName, data) {
    console.log("inbside add -> ", data);
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) =>
        reject(`Add error: ${event.target.errorCode}`);
    });
  }

  async getAllRecords(storeName) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) =>
        reject(`GetAll error: ${event.target.errorCode}`);
    });
  }

  async getRecordsByDate(storeName, date) {
    console.log("storeName ->", storeName);
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const index = store.index("date");
      const request = index.getAll(IDBKeyRange.only(date));
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) =>
        reject(`Get records by date error: ${event.target.errorCode}`);
    });
  }

  async getRecord(storeName, id) {
    const db = await this.openDB();
    console.log("inside get record");
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) =>
        reject(`Get error: ${event.target.errorCode}`);
    });
  }

  async updateRecord(storeName, data) {
    const db = await this.openDB();
    console.log("inside update ", data);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) =>
        reject(`Update error: ${event.target.errorCode}`);
    });
  }

  async deleteRecord(storeName, id) {
    const db = await this.openDB();
    console.log("inside delete ", id);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) =>
        reject(`Delete error: ${event.target.errorCode}`);
    });
  }
}

const dbHandler = new IndexedDBHandler("DailyNotes", 1);
export default dbHandler;
