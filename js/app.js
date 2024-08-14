import Expense from "./expense.js";

const addRecord = async (event) => {
  event.preventDefault();
  const itemName = document.getElementById("itemName").value;
  const price = document.getElementById("price").value;
  const date = document.getElementById("date").value;
  const category = document.getElementById("category").value;

  const expense = new Expense({ itemName, price, category, date });
  const message = await expense.save();
  alert(message);
};

const fetchAll = async () => {
  const expenses = await Expense.all();
  console.log("expenses ->", expenses);
  Expense.all().then((records) => {
    console.log("records -> ", records);
  });
  document.getElementById("allRecordsDisplay").innerText = JSON.stringify(
    expenses,
    null,
    2
  );
};

const findRecord = async () => {
  const id = document.getElementById("get-id").value;
  const expense = await Expense.find(Number(id));
  console.log("expense -> ", expense);
  document.getElementById("new-price").value = expense.price;
  // console.log("expense changed -> ", expense);
  // expense.update();
};

const updateRecord = async () => {
  console.log("insid updateRecord");
  const id = document.getElementById("get-id").value;
  const expense = await Expense.find(Number(id));
  expense.price = document.getElementById("new-price").value;
  expense.update();
};

document.getElementById("expensesForm").addEventListener("submit", addRecord);
document.getElementById("getAllButton").addEventListener("click", fetchAll);
document.getElementById("get-btn").addEventListener("click", findRecord);
document.getElementById("update-btn").addEventListener("click", updateRecord);
