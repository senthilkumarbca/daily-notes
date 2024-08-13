const IndexedDB = (() => {
  let db;

  const openDB = () => {
    return new Promise((resolve, reject) => {
      if (db) {
        return resolve(db);
      }

      const request = indexedDB.open("DailyNotes", 1);

      request.onupgradeneeded = (event) => {
        db = event.target.result;

        if (!db.objectStoreNames.contains("expenses")) {
          const objectStore = db.createObjectStore("expenses", {
            keyPath: "id",
            autoIncrement: true,
          });
          objectStore.createIndex("date", "date", { unique: false });
          objectStore.createIndex("category", "category", { unique: false });
        }
      };

      request.onsuccess = (event) => {
        db = event.target.result;
        resolve(db);
      };

      request.onerror = (event) => {
        reject(`Database error: ${event.target.errorCode}`);
      };
    });
  };

  const addRecord = (storeName, data) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) =>
        reject(`Add error: ${event.target.errorCode}`);
    });
  };

  const init = () => {
    return openDB().then(() => ({
      addRecord,
    }));
  };

  return { init };
})();

export default IndexedDB;
