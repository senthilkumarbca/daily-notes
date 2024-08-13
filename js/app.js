import Expense from "./expense.js";

const addRecord = async (event) => {
  event.preventDefault();
  const itemName = document.getElementById("itemName").value;
  const price = document.getElementById("price").value;
  const date = document.getElementById("date").value;
  const category = document.getElementById("category").value;

  const expense = new Expense(itemName, price, category, date);
  const message = await expense.save();
  alert(message);
};

const fetchAll = async () => {
  const expenses = await Expense.all();
  document.getElementById("allRecordsDisplay").innerText = JSON.stringify(
    expenses,
    null,
    2
  );
};

document.getElementById("expensesForm").addEventListener("submit", addRecord);
document.getElementById("getAllButton").addEventListener("click", fetchAll);
