import dbHandler from "./indexed-db.js";

class Expense {
  constructor(itemName, price, category, date) {
    this.itemName = itemName;
    this.price = price;
    this.category = category;
    this.date = date;
  }

  save() {
    return dbHandler
      .addRecord("expenses", this)
      .then((id) => `Record added with ID: ${id}`)
      .catch((error) => `Add record error: ${error}`);
  }

  static all() {
    return dbHandler
      .getAllRecords("expenses")
      .then((records) => records)
      .catch((error) => `Fetch all records error: ${error}`);
  }
}

export default Expense;
