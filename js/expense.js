import IndexedDB from "./indexed-db.js";

class Expense {
  constructor(itemName, price, category, date) {
    this.itemName = itemName;
    this.price = price;
    this.category = category;
    this.date = date;
  }

  async save() {
    const db = await IndexedDB.init();

    try {
      const id = await db.addRecord("expenses", this);
      alert(`Record added with ID: ${id}`);
    } catch (error) {
      console.error("Add record error:", error);
    }
  }
}

export default Expense;
