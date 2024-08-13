import IndexedDB from "./indexed-db.js";

class Expense {
  constructor(itemName, price, category, date) {
    this.itemName = itemName;
    this.price = price;
    this.category = category;
    this.date = date;
  }

  save() {
    return IndexedDB.init()
      .then((db) => db.addRecord("expenses", this))
      .then((id) => `Record added with ID: ${id}`)
      .catch((error) => `Add record error: ${error}`);
  }

  static all() {
    return IndexedDB.init()
      .then((db) => db.getAllRecord("expenses"))
      .then((records) => {
        return records;
      })
      .catch((error) => console.error("Fetch all records error:", error));
  }
}

export default Expense;
