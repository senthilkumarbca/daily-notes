import Record from "./record.js";

class Expense extends Record {
  static storeName = "expenses";
  constructor({ id = null, itemName = "", price = "", category = "", date }) {
    super();
    if (id) this.id = id;
    this.itemName = itemName;
    this.price = price;
    this.category = category;
    this.date = date;
  }
}

export default Expense;
