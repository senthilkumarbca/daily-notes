import dbHandler from "./indexed-db.js";

class Record {
  save() {
    console.log("insde save -> ", this);
    return dbHandler
      .addRecord(this.constructor.storeName, this)
      .then((id) => `Record added with ID: ${id}`)
      .catch((error) => {
        throw new Error(`Add record error: ${error}`);
      });
  }

  static all() {
    return dbHandler
      .getAllRecords(this.storeName)
      .then((records) => records)
      .catch((error) => `Fetch all records error: ${error}`);
  }

  static allByDate(date) {
    return dbHandler
      .getRecordsByDate(this.storeName, date)
      .then((records) => records)
      .catch((error) => `Fetch all records by date error: ${error}`);
  }

  static find(id) {
    return dbHandler
      .getRecord(this.storeName, id)
      .then((record) => {
        if (record) {
          // Create an instance of the subclass from the plain object
          return new this(record);
        }
        return null;
      })
      .catch((error) => `Find record error: ${error}`);
  }

  update() {
    return dbHandler
      .updateRecord(this.constructor.storeName, this)
      .then((id) => `Record with ID: ${id} updated`)
      .catch((error) => {
        console.error(`Update record error: ${error}`);
        throw new Error(`Sorry, record not updated.`);
      });
  }

  destroy() {
    return dbHandler
      .deleteRecord(this.constructor.storeName, this.id)
      .then((id) => `Record ${id} deleted`)
      .catch((error) => `Delete record error: ${error}`);
  }

  static async export() {
    return dbHandler
      .getAllRecords(this.storeName)
      .then((records) => {
        if (records.length === 0) {
          throw new Error(`No records found in store: ${this.storeName}`);
        }

        const dataStr = JSON.stringify(records);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${this.storeName}_records.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
      })
      .catch((error) => `Export records error: ${error}`);
  }

  static async import(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const records = JSON.parse(event.target.result);
          const storeName = this.storeName;

          for (const record of records) {
            await dbHandler.addRecord(storeName, record);
          }

          resolve(
            `Imported ${records.length} records into store: ${storeName}`
          );
        } catch (error) {
          reject(`Import error: ${error.message}`);
        }
      };

      reader.onerror = () => {
        reject("Failed to read the file.");
      };

      reader.readAsText(file);
    });
  }
}

export default Record;
