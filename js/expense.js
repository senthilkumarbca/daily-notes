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
      .then((id) => alert(`Record added with ID: ${id}`))
      .catch((error) => console.error("Add record error:", error));
  }
}

export default Expense;
