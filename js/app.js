import Expense from "./expense.js";

const content = document.getElementById("main");

const renderExpensesList = async () => {
  const expenses = await Expense.all();
  content.innerHTML = `
      <h2>Your Expenses</h2>
      <ul>
          ${expenses
            .map(
              (expense) => `
              <li>
                  ${expense.itemName} - ${expense.price} - ${expense.category} - ${expense.date}
                  <button onclick="editExpense(${expense.id})">Edit</button>
              </li>
          `
            )
            .join("")}
      </ul>
  `;
};

window.editExpense = async (id) => {
  const expense = await Expense.find(id);
  content.innerHTML = `
      <h2>Edit Expense</h2>
      <form id="editExpenseForm">
          <input type="hidden" id="expenseId" value="${expense.id}">
          <div class="form-item">
              <label for="itemName">Name</label>
              <input type="text" name="itemName" id="itemName" value="${expense.itemName}" required>
          </div>
          <div class="form-item">
              <label for="price">Price</label>
              <input type="number" name="price" id="price" value="${expense.price}" required>
          </div>
          <div class="form-item">
              <label for="category">Category</label>
              <input type="text" id="category" name="category" value="${expense.category}" required>
          </div>
          <div class="form-item">
              <label for="date">Date</label>
              <input type="date" id="date" name="date" value="${expense.date}" required>
          </div>
          <div class="form-item">
              <button type="submit">Update Record</button>
          </div>
      </form>
  `;
};

const renderAddExpenseForm = () => {
  content.innerHTML = `
      <h2>Add New Expense</h2>
      <form id="expensesForm">
          <div class="form-item">
              <label for="itemName">Name</label>
              <input type="text" name="itemName" id="itemName" required>
          </div>
          <div class="form-item">
              <label for="price">Price</label>
              <input type="number" name="price" id="price" required>
          </div>
          <div class="form-item">
              <label for="category">Category</label>
              <input type="text" id="category" name="category" required>
          </div>
          <div class="form-item">
              <label for="date">Date</label>
              <input type="date" id="date" name="date" required>
          </div>
          <div class="form-item">
              <button type="submit">Add Record</button>
          </div>
      </form>
  `;

  document
    .getElementById("expensesForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const expense = new Expense(
        formData.get("itemName"),
        formData.get("price"),
        formData.get("category"),
        formData.get("date")
      );

      await expense.save();
      alert("Expense added successfully");
      renderExpensesList(); // Go back to the expenses list after saving
    });
};

const addRecord = async (event) => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const itemName = formData.get("itemName");
  const price = formData.get("price");
  const date = formData.get("date");
  const category = formData.get("category");

  const expense = new Expense({ itemName, price, category, date });
  const message = await expense.save();
  alert(message);
};

const fetchAll = async () => {
  const dummy = new Expense({});
  console.log("dummy", dummy);
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
  // expense.update();
  const message = await expense.update();
  alert(message);
};

const deleteRecord = async () => {
  console.log("inside delete");
  const id = document.getElementById("get-id").value;
  const expense = await Expense.find(Number(id));
  // message = expense.destroy()
  const message = await expense.destroy();
  alert(message);
};

document.getElementById("expensesForm").addEventListener("submit", addRecord);
document.getElementById("getAllButton").addEventListener("click", fetchAll);
document.getElementById("get-btn").addEventListener("click", findRecord);
document.getElementById("update-btn").addEventListener("click", updateRecord);
document.getElementById("del-btn").addEventListener("click", deleteRecord);
document
  .getElementById("addNewExpense")
  .addEventListener("click", renderAddExpenseForm);
renderExpensesList();
