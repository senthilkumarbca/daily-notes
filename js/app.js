import Expense from "./expense.js";

const addRecord = (event) => {
  event.preventDefault();
  const itemName = document.getElementById("itemName").value;
  const price = document.getElementById("price").value;
  const date = document.getElementById("date").value;
  const category = document.getElementById("category").value;

  const expense = new Expense(itemName, price, category, date);
  expense.save();
};

document.getElementById("expensesForm").addEventListener("submit", addRecord);
